import axios from "axios";
import bluebird from "bluebird";
import { IgApiClient } from "instagram-private-api";
import { UltimateTextToImage } from "ultimate-text-to-image";
import { promises as fs } from "fs";
import get from "request-promise";
const translateGoogle = require("translate-google");

// import {instagramIdToUrlSegment, urlSegmentToInstagramId} from "instagram-id-to-url-segment"

require("dotenv").config();

const ig = new IgApiClient();

async function login() {
  console.log("🚀 Login");
  ig.state.generateDevice(process.env.IG_USERNAME ?? "");
  // await ig.simulate.preLoginFlow();
  try {
    await ig.account.login(
      process.env.IG_USERNAME ?? "",
      process.env.IG_PASSWORD ?? ""
    );
    console.log("✅ Login Success");

  } catch (error) {
    console.log("❌ Error login", error);
  }
  // await ig.simulate.postLoginFlow();
  // process.nextTick(async () => await ig.simulate.postLoginFlow());
}

// get random line
function getRandLine(text: string) {
  let posts = text.split("ᴣᴣᴣ");

  // remove blank lines
  posts = posts.filter(function (el: string) {
    return el != "";
  });

  const rand = Math.floor(Math.random() * posts.length);

  return posts[rand];
}

async function getRandPost() {
  try {
    const results = await fs.readFile("results.txt", "utf8");

    const randLine = getRandLine(results);

    // split randLine by |჻|
    const randLineSplit = randLine.split("|჻|");

    const name = randLineSplit[0];
    const image = randLineSplit[1];
    const text = randLineSplit[2] != "" ? randLineSplit[2] + `\nsource: ${name}` : `source: ${name}`;
    const hashtags = randLineSplit[3];

    return [name, image, text, hashtags];
  } catch (error) {
    return "error";
  }
}

async function generateImage(text: string) {
  const textToImage = new UltimateTextToImage(text, {
    align: "center",
    // instagram post portrait ratio
    width: 1080,
    height: 1350,
    fontSize: 24,
    fontFamily: "Cursive",
    lineHeight: 30,
    margin: 50,
    alignToCenterIfLinesLE: 1,
    // milky white
    backgroundColor: "#f0f0f0",
    // hex grey
    fontColor: "#7e7e7e",
    valign: "middle",
    alignToCenterIfHeightLE: 1,
    // images: [{ canvasImage: canvasImage1, layer: -1, repeat: "fit" }],
  }).render();
  const bufferJpeg = textToImage.toBuffer("image/jpeg", {
    quality: 100,
    progressive: true,
  });
  return bufferJpeg;
}

(async () => {
  await login();

  const source = ["posts"];
  const randSource = source[Math.floor(Math.random() * source.length)];

  let imageBuffer: Buffer;
  let caption: string;
  let hashtags: string;

  async function getQuotes() {
    console.log("🚀 Get Quotes");
    const quotes = await axios("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": process.env.QUOTES_API_KEY,
      },
    });

    const quote = quotes.data[0].quote;
    const author = quotes.data[0].author;
    caption = quote + "\n" + author + "\n";

    imageBuffer = await generateImage(quote + "\n\n" + author);
  }

  async function translateToID(text: string) {
    const randQuoteTextIndo = await translateGoogle(text, { to: "id" });
    const caption = randQuoteTextIndo;
    return caption;
  }

  // Get quotes
  async function getQuotes1() {
    const quotesApiUrl = "https://type.fit/api/quotes";
    let quote: string;

    try {
      console.log("🚀 Get Quotes");

      const quotes = await axios(quotesApiUrl);
      const randQuote = quotes.data[Math.floor(Math.random() * quotes.data.length)];

      const randQuoteText = randQuote.text;

      console.log("✅ Get Quotes Success");

      try {
        console.log("🚀 Translate Quotes");
        const randQuoteTextIndo = await translateToID(randQuoteText);
        console.log("✅ Translate Quotes Success");
        console.log("Translated Quotes", randQuoteTextIndo);
        quote = randQuoteTextIndo;
      } catch (error) {
        console.log("❌ Error translating quotes", error);
        quote = randQuoteText;
      }
    } catch (error) {
      console.log("❌ Error getting quotes", error);
      console.log("🔄 Use default quote");

      quote = "Semoga hari ini kamu bahagia";
    }

    return quote;
  }

  async function getPosts() {
    console.log("🚀 Get Posts");
    const randPost = await getRandPost();

    if (randPost === "error") {
      console.log("❌ Error getting posts");
      console.log("🔄 Try to get quotes");
      return getQuotes();
    }

    console.log("✅ Get Posts Success");

    const randPostImage = randPost[1];
    const randPostText = randPost[2];
    const randPostHashtags = randPost[3];

    console.log("✅ Post Text", randPostText);
    console.log("✅ Source", randPost[0]);


    caption = randPostText;
    hashtags = randPostHashtags;

    try {
      const randPostImageBuffer = await get({
        url: randPostImage,
        encoding: null,
      });

      imageBuffer = randPostImageBuffer;
    } catch (error) {
      console.log("❌ Error getting image", error);
      return getQuotes();
    }
  }

  if (randSource === "posts") {
    getPosts().then(() => {
      publishFeed();
    });
  } else {
    getQuotes().then(() => {
      publishFeed();
    });
  }

  let publishFeedTry = 7;
  async function publishFeed() {
    console.log("🚀 Publish Feed");
    try {
      const publishPhoto = await ig.publish.photo({
        file: imageBuffer,
        caption: caption + "\n\n" + hashtags,
      });

      console.log("✅ Publish Feed Success");

      // delay for random 3 seconds
      await bluebird.delay(Math.floor(Math.random() * 3000) + 3000);

      // like a publishPhoto
      try {
        await ig.media.like({
          mediaId: publishPhoto.media.id,
          moduleInfo: {
            module_name: "profile",
            user_id: publishPhoto.media.user.pk,
            username: publishPhoto.media.user.username,
          },
          d: 0,
        });
        console.log("✅ Like publish feed success");
      } catch (error) {
        console.log("❌ Error like publish feed", error);
      }

      // Get quotes
      const quotesApiUrl = "https://type.fit/api/quotes";
      let quote: string;

      try {
        quote = await getQuotes1();
      } catch (error) {
        console.log("❌ Error getting quotes", error);
        console.log("🔄 Use default quote");

        quote = "Semoga hari ini kamu bahagia";
      }

      // delay for random 3 seconds
      await bluebird.delay(Math.floor(Math.random() * 3000) + 3000);

      // comment a publishPhoto
      try {
        await ig.media.comment({
          mediaId: publishPhoto.media.id,
          text: quote,
        });
        console.log("✅ Comment publish feed success");
      } catch (error) {
        console.log("❌ Error comment publish feed", error);
      }

      // delay for random 3 seconds
      // await bluebird.delay(Math.floor(Math.random() * 3000) + 3000);

      // share a publishPhoto to story
      // try {
      // //   // await ig.media.configureToStory(
      // //   //   {
      // //   //     upload_id: publishPhoto.media.id,
      // //   //     caption: caption,
      // //   //     configure_mode: "1",
      // //   //   }
      // //   // );

      //   ig.publish.story({
      //     file: imageBuffer,
      //     caption: caption,
      //     media: {
      //       media_id: publishPhoto.media.id,
      //       x: 1,
      //       y: 1,
      //       width: 1,
      //       height: 1,
      //       rotation: 0,
      //       is_sticker: false,
      //     },
      //   });

      //   console.log("✅ Share publish feed to story success");
      // } catch (error) {
      //   console.log("❌ Error share publish feed to story", error);
      // }

    } catch (error) {
      console.log("❌ Error publish feed", error);

      console.log("🔄 Try to get posts", publishFeedTry);

      if (publishFeedTry === 0) return console.log("❌ Error publish feed after 7 times");

      getPosts().then(() => {
        publishFeed();
      });
      publishFeedTry--;
    }
  }

  // delay for random 3 seconds
  await bluebird.delay(Math.floor(Math.random() * 3000) + 3000);

  // like and comment 3 timeline feeds
  console.log("🚀 Like Timeline Feeds 3 times");
  let likeNcommentTimes = 3;

  try {
    const feed = ig.feed.timeline();
    const items = await feed.items();

    items.forEach(async (item) => {
      if (likeNcommentTimes === 0) return console.log("✅ Like Timeline Feeds 3 times finished");

      if (item.user.username == "dhohirpradana") return console.log("❌ Skip own feed");

      try {
        // like a timeline feed
        await ig.media.like({
          mediaId: item.id,
          moduleInfo: {
            module_name: "profile",
            user_id: item.user.pk,
            username: item.user.username,
          },
          d: 0,
        });
      } catch (error) {
        console.log("❌ Error like timeline feed", error);
      }

      try {
        // comment a timeline feed
        const comment = await getQuotes1();

        await ig.media.comment({
          mediaId: item.id,
          text: comment,
        });
      } catch (error) {
        console.log("❌ Error comment timeline feed", error);
      }

      // delay for random between 5 and 15 seconds
      await bluebird.delay(Math.floor(Math.random() * 10 + 5) * 1000);

      likeNcommentTimes--;
    });
  } catch (error) {
    console.log("❌ Error get timeline feeds", error);
  }
})();
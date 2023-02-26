import axios from "axios";
import bluebird from "bluebird";
import { IgApiClient } from "instagram-private-api";
import { UltimateTextToImage } from "ultimate-text-to-image";
import { promises as fs } from "fs";
import get from "request-promise";

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
    function getRandLine(text: any) {
      let posts = text.split("ᴣᴣᴣ");

      // remove blank lines
      posts = posts.filter(function (el: string) {
        return el != "";
      });

      let rand = Math.floor(Math.random() * posts.length);

      return posts[rand];
    }

async function getRandPost() {
  try {
    const results = await fs.readFile("results.txt", "utf8");

    let randLine = getRandLine(results);

    // split randLine by |჻|
    let randLineSplit = randLine.split("|჻|");

    let name = randLineSplit[0];
    let image = randLineSplit[1];
    let text = randLineSplit[2] != "" ? randLineSplit[2] + `\nsource: ${name}` : `source: ${name}`;

    return [name, image, text];
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

  let source = ["posts"];
  let randSource = source[Math.floor(Math.random() * source.length)];

  let imageBuffer: Buffer;
  let caption: string;

  async function getQuotes() {
    console.log("🚀 Get Quotes");
    let quotes = await axios("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": process.env.QUOTES_API_KEY,
      },
    });

    let quote = quotes.data[0].quote;
    let author = quotes.data[0].author;
    caption = quote + "\n" + author + "\n";

    imageBuffer = await generateImage(quote + "\n\n" + author);
  }

  async function getPosts() {
    console.log("🚀 Get Posts");
    let randPost = await getRandPost();

    if (randPost === "error") {
      console.log("❌ Error getting posts");
      console.log("🔄 Try to get quotes");
      return getQuotes();
    }

    console.log("✅ Get Posts Success");

    let randPostImage = randPost[1];
    let randPostText = randPost[2];

    console.log("✅ Post Text", randPostText);
    console.log("✅ Source", randPost[0]);


    caption = randPostText;

    try {
      let randPostImageBuffer = await get({
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

  let publishFeedTry = 3;
  async function publishFeed() {
    console.log("🚀 Publish Feed");
    try {
      let publishPhoto = await ig.publish.photo({
        file: imageBuffer,
        caption: caption,
      });

      console.log("✅ Publish Feed Success");

      // delay for random 5 seconds
      await bluebird.delay(Math.floor(Math.random() * 5000) + 5000);

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
      
    } catch (error) {
      console.log("❌ Error publish feed", error);

      console.log("🔄 Try to get posts", publishFeedTry);

      if (publishFeedTry === 0) return console.log("❌ Error publish feed after 3 times");

      getPosts().then(() => {
        publishFeed();
      });
      publishFeedTry--;
    }
  }

  // delay for random 3 seconds
  await bluebird.delay(Math.floor(Math.random() * 3000) + 3000);

  // like 5 timeline feeds
  console.log("🚀 Like Timeline Feeds 3 times");
  let likeTimes = 3;

  try {
    const feed = ig.feed.timeline();
    const items = await feed.items();

    items.forEach(async (item) => {
      if (likeTimes === 0) return console.log("✅ Like Timeline Feeds 3 times finished");

      await ig.media.like({
        mediaId: item.id,
        moduleInfo: {
          module_name: "profile",
          user_id: item.user.pk,
          username: item.user.username,
        },
        d: 0,
      });

      // delay for random between 5 and 15 seconds
      await bluebird.delay(Math.floor(Math.random() * 10 + 5) * 1000);

      likeTimes--;
    });
  } catch (error) {
    console.log("❌ Error get timeline feeds", error);
  }
})();
import axios from "axios";
import bluebird from "bluebird";
import { IgApiClient } from "instagram-private-api";
import { UltimateTextToImage } from "ultimate-text-to-image";
import { promises as fs } from "fs";
import get from "request-promise";

require("dotenv").config();

const ig = new IgApiClient();

async function login() {
  ig.state.generateDevice(process.env.IG_USERNAME ?? "");
  // await ig.simulate.preLoginFlow();
  await ig.account.login(
    process.env.IG_USERNAME ?? "",
    process.env.IG_PASSWORD ?? ""
  );
  // await ig.simulate.postLoginFlow();
  // process.nextTick(async () => await ig.simulate.postLoginFlow());
}

async function getRandPost() {
  try {
    const results = await fs.readFile("results.txt", "utf8");
    // get random line
    function getRandLine(text: any) {
      var posts = text.split("\n");
      var rand = Math.floor(Math.random() * posts.length);
      console.log("🚀 ~ file: app.ts:29 ~ getRandLine ~ rand", rand);
      return posts[rand];
    }
    var randLine = getRandLine(results);
    return randLine;
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

  var source = ["posts"];
  var randSource = source[Math.floor(Math.random() * source.length)];
  // console.log("🚀 ~ file: app.ts:65 ~ randSource", randSource);

  let imageBuffer: Buffer;
  let caption: string;

  async function getQuotes() {
    console.log("🚀 Get Quotes");
    var quotes = await axios("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": process.env.QUOTES_API_KEY,
      },
    });

    var quote = quotes.data[0].quote;
    var author = quotes.data[0].author;
    caption = quote + "\n" + author + "\n";

    imageBuffer = await generateImage(quote + "\n\n" + author);
  }

  async function getPosts() {
    console.log("🚀 Get Posts");
    var randPost = await getRandPost();

    if (randPost === "error") return getQuotes();
    // console.log("🚀 ~ file: app.ts:80 ~ randPost", randPost)

    // split randPost by ||
    var randPostSplit = randPost.split("||");
    var randPostName = randPostSplit[0];
    var randPostImage = randPostSplit[1];
    var randPostText = randPostSplit[2] ?? `Image from ${randPostName}`;

    console.log("🚀 randPostText", randPostText);
    // console.log(`from ${randPostName}, image url ${randPostImage}`);

    caption = randPostText;

    try {
      var randPostImageBuffer = await get({
        url: randPostImage,
        encoding: null,
      });

      imageBuffer = randPostImageBuffer;
    } catch (error) {
      console.log("🚀 ~ file: app.ts:117 ~ getPosts ~ error", error)
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

  async function publishFeed() {
    console.log("🚀 Publish Feed");
    try {
      var publishPhoto = await ig.publish.photo({
        file: imageBuffer,
        caption: caption,
      });

      // delay for 5 seconds
      await bluebird.delay(5000);

      // like a publishPhoto
      await ig.media.like({
        mediaId: publishPhoto.media.id,
        moduleInfo: {
          module_name: "profile",
          user_id: publishPhoto.media.user.pk,
          username: publishPhoto.media.user.username,
        },
        d: 0,
      });
    } catch (error) {
      console.log("🚀 ~ file: app.ts:88 ~ error", error);
    }
  }

  // delay for 3 seconds
  await bluebird.delay(3000);

  try {
    // like 5 user feed
    const feed = ig.feed.timeline();
    const items = await feed.items();
    // console.log("🚀 ~ file: app.ts:117 ~ items", items)

    var likeTimes = 3;
    items.forEach(async (item) => {
      if (likeTimes === 0) return;
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
    console.log("🚀 ~ file: app.ts:117 ~ error", error);
  }
})();

// const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

// const photos = await axios(
//   "https://api.unsplash.com/photos/random?query=minimal",
//   {
//     headers: {
//       Authorization: `Client-ID ${unsplashAccessKey}`,
//     },
//   }
// );

// const data = photos.data;
// var photo = data;
// var user = photo.user;
// var username = user.username;
// var credit = `\nPhoto by ${username} on Unsplash`;
// var link = photo.urls.regular;

// // share to story
// try {
//   const story = await ig.publish.story({
//     file: imageBuffer,
//     stickerConfig: new StickerBuilder()
//       .add(
//         StickerBuilder.hashtag({
//           tagName: "minimal",
//         }).center()
//       )
//       // .add(
//       //   StickerBuilder.attachmentFromMedia(
//       //     (
//       //       await ig.feed.timeline().items()
//       //     )[0]
//       //   ).center()
//       // )
//       .build(),
//   });
//   console.log("🚀 ~ file: app.ts:73 ~ story", story);
// } catch (error) {
//   console.log("🚀 ~ file: app.ts:88 ~ error", error);
// }

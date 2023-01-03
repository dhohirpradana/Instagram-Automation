import axios from "axios";
import bluebird from "bluebird";
import { IgApiClient } from "instagram-private-api";
import { StickerBuilder } from "instagram-private-api/dist/sticker-builder";
import { get } from "request-promise";

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
}

(async () => {
  await login();
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

  const photos = await axios(
    "https://api.unsplash.com/photos/random?query=minimal",
    {
      headers: {
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
    }
  );

  const data = photos.data;
  var photo = data;
  var user = photo.user;
  var username = user.username;
  var credit = `\nPhoto by ${username} on Unsplash`;
  var link = photo.urls.regular;

  var quotes = await axios("https://api.api-ninjas.com/v1/quotes", {
    headers: {
      "X-Api-Key": process.env.QUOTES_API_KEY,
    },
  });

  var quote = quotes.data[0].quote;
  var author = quotes.data[0].author;

  const imageBuffer = await get({
    url: link,
    encoding: null,
  });

  var publishPhoto = await ig.publish.photo({
    file: imageBuffer,
    caption: quote + "\n" + author + "\n" + credit,
  });
  console.log(
    "🚀 ~ file: index.js:49 ~ postToInsta ~ publistPhoto",
    publishPhoto
  );

  // delay for 3 seconds
  await bluebird.delay(3000);

  // share to story
  const story = await ig.publish.story({
    file: imageBuffer,
    stickerConfig: new StickerBuilder()
      .add(
        StickerBuilder.hashtag({
          tagName: "minimal",
        }).center()
      )
      // .add(
      //   StickerBuilder.attachmentFromMedia(
      //     (
      //       await ig.feed.timeline().items()
      //     )[0]
      //   ).center()
      // )
      .build(),
  });
  console.log("🚀 ~ file: app.ts:73 ~ story", story);

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
})();

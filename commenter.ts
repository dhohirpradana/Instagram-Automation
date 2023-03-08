const axios = require("axios");
import bluebird from "bluebird";
import { IgApiClient } from "instagram-private-api";
const translateGoogle = require("translate-google");

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

(async () => {
  await login();

  const source = ["posts"];
  const randSource = source[Math.floor(Math.random() * source.length)];

  async function translateToID(text: string) {
    const randQuoteTextIndo = await translateGoogle(text, { to: "id" });
    const caption = randQuoteTextIndo;
    return caption;
  }

  async function getQuotes() {
    console.log("🚀 Get Quotes");
    const quotes = await axios("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": process.env.QUOTES_API_KEY,
      },
    });

    const quote = quotes.data[0].quote;
    const translateQuote = await translateToID(quote);

    console.log("✅ Get Quotes Success", translateQuote);

    return translateQuote;
  }

  // like and comment 1 timeline feeds
  console.log("🚀 Like Timeline Feeds 1 times");
  let likeNcommentTimes = 1;

  try {
    const feed = ig.feed.timeline();
    const items = await feed.items();

    items.forEach(async (item) => {
      if (likeNcommentTimes === 0) return console.log("✅ Like Timeline Feeds 1 times finished");

      if (item.user.username == "dhohirpradana") return console.log("❌ Skip own feed");

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

      // comment a timeline feed
      const comment = await getQuotes();

      await ig.media.comment({
        mediaId: item.id,
        text: comment,
      });

      console.log("✅ Like and Comment Timeline Feeds Success " + likeNcommentTimes);

      // delay for random between 5 and 15 seconds
      await bluebird.delay(Math.floor(Math.random() * 10 + 5) * 1000);

      likeNcommentTimes--;
    });
  } catch (error) {
    console.log("❌ Error get timeline feeds", error);
  }
})();
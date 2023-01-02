require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const axios = require("axios");
const get = require("request-promise").defaults({ encoding: null });

const postToInsta = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

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
  var credit = `\nPhoto by https://unsplash.com/@${username}`;
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

  var publistPhoto = await ig.publish.photo({
    file: imageBuffer,
    caption: quote + "\n" + author + "\n" + credit,
  });
  console.log("publistPhoto", publistPhoto);
};

postToInsta();

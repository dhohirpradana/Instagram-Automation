const translateGoogle = require("translate-google");

async function translate(text: string) {
    const randQuoteTextIndo = await translateGoogle(text, { to: "id" });
    const caption = randQuoteTextIndo;
    console.log(caption);
    return caption;
}

translate("hello world");
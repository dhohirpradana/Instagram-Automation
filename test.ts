import { promises as fs } from "fs";

async function getRandPost() {
    try {
      const results = await fs.readFile("results.txt", "utf8");
  
      // get random line
      function getRandLine(text: any) {
        var posts = text.split("ᴣᴣᴣ");
        // remove blank lines
        posts = posts.filter(function (el: string) {
            return el != "";
        });
        var rand = Math.floor(Math.random() * posts.length);
        return posts[rand];
      }
      var randLine = getRandLine(results);
      console.log("🚀 ~ file: test.ts:18 ~ getRandPost ~ randLine", randLine)
      return randLine;
    } catch (error) {
      return "error";
    }
  }

  getRandPost();
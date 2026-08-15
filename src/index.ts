import { argv } from "node:process";

async function main() {
  const args = argv.slice(2);
  if (args.length > 1) {
    console.log("Too many arguments. Provide one URL please.");
    process.exit(1);
  }

  if (args.length < 1) {
    console.log("No arguments provides. Provide one URL please.");
    process.exit(1);
  }

  const url = args[0];

  console.log(`Crawling starting at ${url}`);

  const html = await getHTML(url);
  console.log(html);
  process.exit(0);
}

async function getHTML(url: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Crawler/1.0",
        "Content-Type": "text/html",
      },
    });

    if (res.status >= 400) {
      console.log(`Error in getting a response, code: ${res.status}`);
      return;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.log("Got non html response");
    }

    return res.text();
  } catch (err) {
    console.error(`couldn't crawl site due to: ${err}`);
  }
}

main();

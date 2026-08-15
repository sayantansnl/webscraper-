import { argv } from "node:process";
import { crawlSiteAsync } from "./crawl.js";

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

  const pagesCrawled = await crawlSiteAsync(url);
  console.log(`Pages Crawled: `);
  console.log(pagesCrawled);
  process.exit(0);
}

await main();

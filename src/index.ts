import { argv } from "node:process";
import { crawlSiteAsync } from "./crawl.js";

async function main() {
  const args = argv.slice(2);

  if (args.length < 1) {
    console.log(
      "No arguments provides. Usage 'npm run start <url> <maxConcurrency> <maxPages>'.",
    );
    process.exit(1);
  }

  const url = args[0];
  const maxConcurrency = Number(args[1]);
  const maxPages = Number(args[2]);

  console.log(`Crawling starting at ${url}`);

  const pagesCrawled = await crawlSiteAsync(url, maxConcurrency, maxPages);
  console.log(`Pages Crawled: `);
  console.log(pagesCrawled);

  console.log("Finished crawling.");
  const firstPage = Object.values(pagesCrawled)[0];
  if (firstPage) {
    console.log(
      `First page record: ${firstPage["url"]} - ${firstPage["heading"]}`,
    );
  }
  process.exit(0);
}

await main();

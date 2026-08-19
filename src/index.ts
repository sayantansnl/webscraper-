import { argv } from "node:process";
import { crawlSiteAsync } from "./crawl.js";
import {
  writeEdgesReportFromURLToURL,
  writeJSONReportForPageData,
} from "./report.js";
import { generateGraphPNG } from "./graph.js";

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

  const { pageData, edges } = await crawlSiteAsync(
    url,
    maxConcurrency,
    maxPages,
  );
  console.log(`Pages Crawled: `);
  console.log(pageData);

  console.log("Edges formed: ");
  console.log(edges);

  console.log("Finished crawling.");
  const firstPage = Object.values(pageData)[0];
  if (firstPage) {
    console.log(
      `First page record: ${firstPage["url"]} - ${firstPage["heading"]}`,
    );
  }

  writeJSONReportForPageData(pageData);
  writeEdgesReportFromURLToURL(edges);

  console.log("Crawling complete. Generating graph image...");
  await generateGraphPNG(pageData, edges, "crawl-graph.png");
  console.log("Saved graph visualization to crawl-graph.png");

  process.exit(0);
}

await main();

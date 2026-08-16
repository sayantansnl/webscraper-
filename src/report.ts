import path from "node:path";
import { ExtractedPageData } from "./crawl.js";
import { writeFileSync } from "node:fs";

export function writeJSONReport(
  pageData: Record<string, ExtractedPageData>,
  filename = "report.json",
): void {
  const sorted = Object.values(pageData).sort((a, b) =>
    a.url.localeCompare(b.url),
  );
  const data = JSON.stringify(sorted, null, 2);
  const pathX = path.resolve(process.cwd(), filename);

  writeFileSync(pathX, data);
}

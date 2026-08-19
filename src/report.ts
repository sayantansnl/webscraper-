import path from "node:path";
import { Edge, ExtractedPageData } from "./crawl.js";
import { writeFileSync } from "node:fs";

export function writeJSONReportForPageData(
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

export function writeEdgesReportFromURLToURL(
  edges: Edge[],
  filename = "edges.json",
): void {
  const data = JSON.stringify(edges, null, 2);
  const pathX = path.resolve(process.cwd(), filename);

  writeFileSync(pathX, data);
}

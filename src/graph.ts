import * as pureimage from "pureimage";
import * as fs from "fs";
import * as path from "path";
import { Edge, ExtractedPageData } from "./crawl.js";

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export function computeCircularLayout(
  pageUrls: string[],
  width: number,
  height: number,
): Map<string, GraphNode> {
  const nodes = new Map<string, GraphNode>();
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.7;
  const total = pageUrls.length || 1;

  pageUrls.forEach((url, i) => {
    const angle = (i / total) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    let label = "/";
    try {
      const urlObj = new URL(fullUrl);
      label = urlObj.pathname === "" ? "/" : urlObj.pathname;
    } catch {
      label = url;
    }

    nodes.set(url, { id: url, label, x, y });
  });

  return nodes;
}

export async function generateGraphPNG(
  pages: Record<string, ExtractedPageData>,
  edges: Edge[],
  outputPath: string,
): Promise<void> {
  const width = 1200;
  const height = 900;
  const boxSize = 24;

  const fontPath = path.resolve("assets/IBMPlexMono-Regular.ttf");
  const font = pureimage.registerFont(fontPath, "IBMPlexMono");
  font.loadSync();

  const img = pureimage.make(width, height);
  const ctx = img.getContext("2d");

  const pageUrls = Object.keys(pages);
  const nodeMap = computeCircularLayout(pageUrls, width, height);

  ctx.fillStyle = "#1e1e2e";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#89b4fa";
  ctx.lineWidth = 2;

  let edgesDrawn = 0;
  for (const edge of edges) {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);

    if (fromNode && toNode) {
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
      edgesDrawn++;
    }
  }
  console.log(
    `Rendered ${nodeMap.size} nodes and ${edgesDrawn} edges to graph.`,
  );

  ctx.font = "14pt IBMPlexMono";

  for (const node of nodeMap.values()) {
    ctx.fillStyle = "#a6e3a1";
    ctx.fillRect(node.x - boxSize / 2, node.y - boxSize / 2, boxSize, boxSize);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(node.label, node.x - boxSize / 2, node.y - boxSize);
  }

  const writeStream = fs.createWriteStream(outputPath);
  await pureimage.encodePNGToStream(img, writeStream);
}

# WebWeaver - A web scarper & link graph visualizer. 

A fast, concurrent web scraper written in TypeScript. It traverses a target website within its domain, records page relationship 
(internal links), and generates a 2D network graph visualization as a PNG image using `pureimage`.

---

## Features 

- **Concurrent Crawling**: Utilizes concurrency controls to fetch multiple pages in parallel without overwhelming the target server.
- **URL Normalization**: Normalizes URLs to avoid duplicate crawling and infinite loops caused by trailing slashes,
protocol differences, or query parameters.
- **Domain Bounded Traversal**: Restricts crawling strictly to internal links belonging to the same host domain.
- **Graph Visualization**: Tracks directed link relationships between pages and renders a 2D network graph to a PNG file
(`crawl-graph.png`) using the HTML5 Canvas 2D API via `pureimage`.

---

## Tech stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Concurrency**: `p-limit`
- **Graphics Engine**: `pureimage` (100% pure JavaScript Canvas API)
- **HTML Parsing**: `jsdom`

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

---

## Installation and Setup

1. Clone this repository: `git clone https://github.com/sayantansnl/webweaver`
2. Use the correct node version: `nvm use`
3. Install dependencies: `npm install`

---

## Usage

Run the crawler by providing the starting URL, the maximum concurrency level, and the maximum page limit.
`npm run start "<URL>" <concurrency> <maxPages>`

Example: `npm run start "https://learnwebscraping.dev/practice/ecommerce/" 2 20`

---

## How the graph generator works

1. **Edge Tracking**: During traversal, each discovered link is recorded as an edge `{ from: string, to: string }` which can be found
   in the generated report file: `edges.json`.
2. **Circular Layout**: A trigonometric layout function computes `(x,y)` coordinates in a circular arrangement to balance space and
   avoid node collisions.
3. **Canvas Drawing**: `pureimage` draws background canvas, connecting lines between linked pages, node blocks, and URL pathname labels.

---

Consider starring the repository if you found this useful.

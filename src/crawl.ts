import { JSDOM } from "jsdom";
import pLimit from "p-limit";

interface ExtractedPageData {
  url: string;
  heading: string;
  first_paragraph: string;
  outgoing_links: string[];
  image_urls: string[];
}

export function extractPageData(
  html: string,
  pageURL: string,
): ExtractedPageData {
  return {
    url: pageURL,
    heading: getHeadingFromHTML(html),
    first_paragraph: getFirstParagraphFromHTML(html),
    outgoing_links: getURLsFromHTML(html, pageURL),
    image_urls: getImagesFromHTML(html, pageURL),
  };
}

export function normalizeURL(inputURL: string): string {
  const parsed = new URL(inputURL);
  const hostname = parsed.hostname;
  let pathname = parsed.pathname;

  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, pathname.length - 1);
  }

  return `${hostname}${pathname}`;
}

export function getHeadingFromHTML(html: string): string {
  const dom = new JSDOM(html);
  const headingTag = html.includes("<h1>") ? "h1" : "h2";
  const heading = dom.window.document.querySelector(headingTag);
  return heading?.textContent.trim() ?? "";
}

export function getFirstParagraphFromHTML(html: string): string {
  const dom = new JSDOM(html);
  const paragraphTag = html.includes("<main>") ? "main p" : "p";
  const paragraph = dom.window.document.querySelector(paragraphTag);
  return paragraph?.textContent.trim() ?? "";
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  let urls: string[] = [];

  const anchors = dom.window.document.querySelectorAll("a");
  anchors.forEach((anchor) => {
    const hrefAttr = anchor.getAttribute("href");
    if (!hrefAttr) return;
    const url = new URL(hrefAttr, baseURL).toString();
    urls.push(url);
  });
  return urls;
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  const imgURLs: string[] = [];

  const images = dom.window.document.querySelectorAll("img");
  images.forEach((image) => {
    const srcAttr = image.getAttribute("src");
    if (!srcAttr) {
      return;
    }
    const url = new URL(srcAttr, baseURL).toString();
    imgURLs.push(url);
  });

  return imgURLs;
}

class ConcurrentCrawler {
  private baseURL: string;
  private pages: Record<string, number> = {};
  private limit: ReturnType<typeof pLimit>;
  private maxPages: number;
  private shouldStop: boolean = false;
  private allTasks: Set<Promise<void>> = new Set<Promise<void>>();
  private visited: Set<string> = new Set<string>();

  constructor(baseURL: string, maxConcurrency: number, maxPages: number = 100) {
    this.baseURL = baseURL;
    this.limit = pLimit(maxConcurrency);
    this.maxPages = Math.max(1, maxPages);
  }

  private addPageVisit(normalizedURL: string): boolean {
    if (this.shouldStop) {
      return false;
    }
    if (normalizedURL in this.pages) {
      this.pages[normalizedURL] += 1;
    } else {
      this.pages[normalizedURL] = 1;
    }

    if (this.visited.has(normalizedURL)) {
      return false;
    }

    if (this.visited.size >= this.maxPages) {
      this.shouldStop = true;
      console.log("Reached the maximum number of pages");
      return false;
    }

    this.visited.add(normalizedURL);
    return true;
  }

  private async getHTML(currentURL: string): Promise<string> {
    return await this.limit(async () => {
      let res;
      try {
        res = await fetch(currentURL, {
          method: "GET",
          headers: {
            "User-Agent": "Crawler/1.0",
          },
        });
      } catch (err) {
        console.error(`couldn't crawl site due to error: ${err}`);
      }

      const contentType = res!.headers.get("content-type");
      if (!contentType || !contentType.includes("text/html")) {
        console.log("Got non html response");
      }

      return res!.text();
    });
  }

  private async crawlPage(currentURL: string): Promise<void> {
    if (this.shouldStop) {
      return;
    }
    const parsedBaseURL = new URL(this.baseURL);
    const parsedCurrentURL = new URL(currentURL);

    if (parsedBaseURL.hostname !== parsedCurrentURL.hostname) {
      return;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (!this.addPageVisit(normalizedCurrentURL)) {
      return;
    }

    const html = await this.getHTML(currentURL);

    console.log(`Now crawling ${currentURL}`);
    console.log("\n" + html);

    const urls = getURLsFromHTML(html, currentURL);
    const promises: Promise<void>[] = [];

    for (const url of urls) {
      const task = this.crawlPage(url);
      promises.push(task);
      this.allTasks.add(task);
      task.finally(() => {
        this.allTasks.delete(task);
      });
    }

    await Promise.all(promises);
  }

  async crawl(): Promise<Record<string, number>> {
    await this.crawlPage(this.baseURL);

    return this.pages;
  }
}

export async function crawlSiteAsync(
  url: string,
  maxConcurrency: number,
  maxPages: number,
): Promise<Record<string, number>> {
  const crawler = new ConcurrentCrawler(url, maxConcurrency, maxPages);
  const pages = await crawler.crawl();
  return pages;
}

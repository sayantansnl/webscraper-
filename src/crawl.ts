import { JSDOM } from "jsdom";

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
  let imgURLs: string[] = [];

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

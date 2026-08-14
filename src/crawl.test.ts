import { describe, expect, test } from "vitest";
import {
  getFirstParagraphFromHTML,
  getHeadingFromHTML,
  getImagesFromHTML,
  getURLsFromHTML,
  normalizeURL,
} from "./crawl.js";

describe("Normalizing URL", () => {
  test("for https://www.boot.dev/blog/path", () => {
    const url = "https://www.boot.dev/blog/path";
    const normalizedURL = "www.boot.dev/blog/path";
    expect(normalizeURL(url)).toBe(normalizedURL);
  });

  test("for http://www.boot.dev/blog/path/", () => {
    const url = "http://www.boot.dev/blog/path/";
    const normalizedURL = "www.boot.dev/blog/path";
    expect(normalizeURL(url)).toBe(normalizedURL);
  });

  test("normalizeURL slash", () => {
    const input = "https://crawler-test.com/path/";
    const actual = normalizeURL(input);
    const expected = "crawler-test.com/path";
    expect(actual).toEqual(expected);
  });

  test("normalizeURL capitals", () => {
    const input = "https://CRAWLER-TEST.com/path";
    const actual = normalizeURL(input);
    const expected = "crawler-test.com/path";
    expect(actual).toEqual(expected);
  });
});

describe("Extracting heading", () => {
  test("h1 present h2 present", () => {
    const html = `<html>
            <body>
                <h1>Let's Fight!</h1>
                <h2>Grab your hockey sticks!</h2>
            </body>
        </html>`;

    const expected = "Let's Fight!";
    expect(getHeadingFromHTML(html)).toEqual(expected);
  });

  test("h1 absent h2 present", () => {
    const html = `<html>
        <body>
            <h2>Grab your helmet and wear your gloves!</h2>
        </body>
      </html>`;

    const expected = "Grab your helmet and wear your gloves!";
    expect(getHeadingFromHTML(html)).toEqual(expected);
  });

  test("h1 present h2 absent", () => {
    const html = `<html>
        <body>
            <h1>We dine in hell!</h1>
        </body>
      </html>`;

    const expected = "We dine in hell!";
    expect(getHeadingFromHTML(html)).toEqual(expected);
  });
});

describe("Extract first paragraph", () => {
  test("getFirstParagraphFromHTML main priority", () => {
    const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "Main paragraph.";
    expect(actual).toEqual(expected);
  });

  test("getFirstParagraphFromHTML fallback to first p", () => {
    const inputBody = `
    <html><body>
      <p>First outside paragraph.</p>
      <p>Second outside paragraph.</p>
    </body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "First outside paragraph.";
    expect(actual).toEqual(expected);
  });

  test("getFirstParagraphFromHTML no paragraphs", () => {
    const inputBody = `<html><body><h1>Title</h1></body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "";
    expect(actual).toEqual(expected);
  });
});

describe("Extract URLs", () => {
  test("getURLsFromHTML absolute", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`;

    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/path/one"];

    expect(actual).toEqual(expected);
  });

  test("getURLsFromHTML multiple", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="/path/some">I am rock!</a><a href="/path/nowhere">Most Wanted Cars are better</a></body></html>`;

    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/path/some",
      "https://crawler-test.com/path/nowhere",
    ];
    expect(actual).toEqual(expected);
  });

  test("getURLsFromHTML relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/path/one"];
    expect(actual).toEqual(expected);
  });

  test("getURLsFromHTML both absolute and relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody =
      `<html><body>` +
      `<a href="/path/one"><span>Boot.dev</span></a>` +
      `<a href="https://other.com/path/one"><span>Boot.dev</span></a>` +
      `</body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/path/one",
      "https://other.com/path/one",
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Extract Images", () => {
  test("getImagesFromHTML relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;

    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/logo.png"];

    expect(actual).toEqual(expected);
  });

  test("getImagesFromHTML relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/logo.png"];
    expect(actual).toEqual(expected);
  });

  test("getImagesFromHTML multiple", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody =
      `<html><body>` +
      `<img src="/logo.png" alt="Logo">` +
      `<img src="https://cdn.boot.dev/banner.jpg">` +
      `</body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/logo.png",
      "https://cdn.boot.dev/banner.jpg",
    ];
    expect(actual).toEqual(expected);
  });
});

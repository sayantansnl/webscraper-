import { describe, expect, test } from "vitest";
import { normalizeURL } from "./crawl.js";

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

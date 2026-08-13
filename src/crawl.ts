export function normalizeURL(inputURL: string): string {
  const parsed = new URL(inputURL);
  const hostname = parsed.hostname;
  let pathname = parsed.pathname;

  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, pathname.length - 1);
  }

  return `${hostname}${pathname}`;
}

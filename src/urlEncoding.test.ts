import { encodeUrl } from "./urlEncoding";

describe("encodeUrl", () => {
  it("can combine a url correctly!", () => {
    const baseUrl = "https://www.myurl.com";
    const params = { a: 1, b: 2, c: 3 };
    const expectedUrl = "https://www.myurl.com?a=1&b=2&c=3";

    expect(encodeUrl(baseUrl, params)).toBe(expectedUrl);
  });
});

/**
 * Encode the object provided as url parameters
 * @param parameters
 * @returns an encoded parameters section of a url
 */
export const encodeUrlParams = (parameters: {
  [s: string]: string | number | boolean;
}) =>
  Object.entries(parameters)
    .map((kv) => kv.map(encodeURIComponent).join("="))
    .join("&");

/**
 * Build a url using a url and parameters
 * @param url
 * @param parameters
 * @returns
 */
export const encodeUrl = (
  url: string,
  parameters: {
    [s: string]: string | number | boolean;
  }
) => {
  return `${url}?${encodeUrlParams(parameters)}`;
};

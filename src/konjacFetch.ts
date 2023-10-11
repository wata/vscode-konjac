const rp = require('request-promise-native');
const encodeUrl = require('encodeurl');

/**
 * translate text using Konjac API
 * @returns 
 */
export function konjacFetch({
  text,
  apiUrl,
  target,
  source,
}: {
  /** text to translate */
  text: string;
  /** api url of konjac */
  apiUrl: string;
  /** target language */
  target?: string;
  /** source language */
  source?: string;
}): Promise<string> {
  const formData : Partial<Record<"source"|"target"|"text", string>> = { text };
  if(source && source !== "auto") { formData.source = source; }
  if(target && target !== "auto") { formData.target = target; }
  const opts: any = {
      uri: encodeUrl(apiUrl),
      method: 'POST',
      json: true,
      followAllRedirects: true,
      formData,
      transform2xxOnly: true,
      transform: function (body: any) {
          // Google Apps Script Execution API always returns 200
          if (!body.data) {
              throw new Error(body.message);
          }
          return body.data.translatedText;
      }
  };
  return rp(opts).then((result: unknown) => String(result));
}

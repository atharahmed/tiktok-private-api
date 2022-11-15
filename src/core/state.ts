export class State {
  private _webUserAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35";

  private _mobileUserAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1";

  private _defaultApiHeaders = {
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip",
    "accept-language": "en-US,en;q=0.9",
    origin: "https://www.tiktok.com",
    referer: "https://www.tiktok.com/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "sec-gpc": "1",
  };

  public set mobileUserAgent(mobileUserAgent: string) {
    this._mobileUserAgent = mobileUserAgent;
  }

  public get mobileUserAgent() {
    return this._mobileUserAgent;
  }

  public set webUserAgent(webUserAgent: string) {
    this._webUserAgent = webUserAgent;
  }

  public get webUserAgent() {
    return this._webUserAgent;
  }

  public get defaultApiHeaders() {
    return this._defaultApiHeaders;
  }
}

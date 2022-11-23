export class State {
  private _webUserAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35";

  private _mobileUserAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1";

  private _defaultHeaders: any = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua":
      '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": this._webUserAgent,
  };

  private _defaultApiHeaders: any = {
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip",
    "accept-language": "en-US,en;q=0.9",
    origin: "https://www.tiktok.com",
    referer: "https://www.tiktok.com/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "sec-gpc": "1",
    "user-agent": this._webUserAgent,
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

  public set defaultHeaders(headers: any) {
    this._defaultHeaders = headers;
  }

  public get defaultHeaders() {
    return this._defaultHeaders;
  }

  public set defaultApiHeaders(headers: any) {
    this._defaultApiHeaders = headers;
  }

  public get defaultApiHeaders() {
    return this._defaultApiHeaders;
  }
}

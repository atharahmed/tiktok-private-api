import qs from "qs";
import debug from "debug";
import { TikTokClient } from "../core/client";
import { Repository } from "../core/repository";
import { GenericError, UserNotfoundError } from "../errors";

import { UserRepositoryInfoResponseUserInfoRoot } from "../responses";

export class UserRepository extends Repository {
  private userDebug = debug("tiktok:user");

  private _defaultApiParams = {
    aid: "1988",
    app_name: "tiktok_web",
    device_platform: "web_mobile",
    region: "US",
    os: "ios",
    cookie_enabled: "true",
    screen_width: "1065",
    screen_height: "1623",
    browser_language: "en-gb",
    browser_platform: "iPhone",
    browser_name: "Mozilla",
    browser_version: this.client.state.mobileUserAgent,
    browser_online: "true",
    timezone_name: "Asia/Karachi",
    is_page_visible: "true",
    focus_state: "true",
    is_fullscreen: "false",
    history_len: null,
    language: "en",
    count: null,
    id: null,
    cursor: null,
    type: "1",
    secUid: null,
    sourceType: "8",
    appId: "1233",
    priority_region: "US",
    verifyFp: "verify_khr3jabg_V7ucdslq_Vrw9_4KPb_AJ1b_Ks706M8zIJTq",
    device_id: null,
  };

  constructor(private client: TikTokClient) {
    super();
  }

  /**
   * Get user info
   *
   * @param username
   * @returns
   */
  public async info(
    username: string
  ): Promise<UserRepositoryInfoResponseUserInfoRoot | null> {
    const url = `https://www.tiktok.com/@${username}?lang=en`;

    this.userDebug(`Sending request to ${url}`);

    const headers = {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="103", "Google Chrome";v="103"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent": this.client.state.webUserAgent,
    };
    const response = await this.client.request.send(url, headers);

    const parsed = await this.parseHtmlContent(response.body);

    if (parsed) {
      const obj = JSON.parse(parsed);

      const userModule = obj["UserModule"];
      const itemModule = obj["ItemModule"];

      return {
        userInfo: {
          ...userModule.users[username],
          stats: userModule.stats[username],
          itemList: Object.values(itemModule),
        },
        seoProps: {
          metaParams: obj["SEO"]["metaParams"],
        },
      };
    }

    return null;
  }

  /**
   * Get user videos
   *
   * @param id
   * @param secUid
   * @param count
   * @param cursor
   * @returns
   */
  public async videos(
    id: number,
    secUid: string,
    count: number,
    cursor: number
  ) {
    const deviceId = this.client.helper.generateDeviceId();

    let url = new URL(
      `https://m.tiktok.com/api/post/item_list/?${qs.stringify({
        ...this._defaultApiParams,
        id: id,
        secUid: secUid,
        count: count,
        cursor: cursor,
        device_id: deviceId,
        history_len: this.client.helper.getRandomInt(1, 5),
      })}`
    );

    const signature = this.client.signer.sign(url.toString());

    url.searchParams.append("_signature", signature);

    this.userDebug(`Generated signed url ${url.toString()}`);

    const bogus = this.client.signer.bogus(url.searchParams.toString());

    url.searchParams.append("X-bogus", bogus);

    this.userDebug(`Generated bogus url ${url}`);

    const xTTParams = this.client.signer.xttparams(url.searchParams.toString());

    const response = await this.client.request.send(url.toString(), {
      ...this.client.state.defaultApiHeaders,
      "user-agent": this.client.state.mobileUserAgent,
      "x-tt-params": xTTParams,
    });

    const responseBody = JSON.parse(response.body);

    if (responseBody.statusCode === 0 && responseBody.itemList) {
      return responseBody;
    }

    throw new GenericError("Generic API error happened.");
  }

  /**
   * Get user liked videos
   *
   * @param id
   * @param secUid
   * @param count
   * @param cursor
   * @returns
   */
  public async liked(
    id: number,
    secUid: string,
    count: number,
    cursor: number
  ) {
    const deviceId = this.client.helper.generateDeviceId();

    let url = new URL(
      `https://m.tiktok.com/api/favorite/item_list/?${qs.stringify({
        ...this._defaultApiParams,
        id: id,
        secUid: secUid,
        count: count,
        cursor: cursor,
        device_id: deviceId,
        history_len: this.client.helper.getRandomInt(1, 5),
      })}`
    );

    const signature = this.client.signer.sign(url.toString());

    url.searchParams.append("_signature", signature);

    this.userDebug(`Generated signed url ${url.toString()}`);

    const bogus = this.client.signer.bogus(url.searchParams.toString());

    url.searchParams.append("X-bogus", bogus);

    this.userDebug(`Generated bogus url ${url}`);

    const xTTParams = this.client.signer.xttparams(url.searchParams.toString());

    const response = await this.client.request.send(url.toString(), {
      ...this.client.state.defaultApiHeaders,
      "user-agent": this.client.state.mobileUserAgent,
      "x-tt-params": xTTParams,
    });

    const responseBody = JSON.parse(response.body);

    if (responseBody.statusCode === 0 && responseBody.itemList) {
      return responseBody;
    }

    throw new GenericError("Generic API error happened.");
  }

  /**
   * Parse TikTok response and return sigi_state
   *
   * @param content
   * @returns
   */
  private async parseHtmlContent(content: string) {
    if (content.includes("SIGI_STATE")) {
      const rawVideoMetadata = content
        .split('<script id="SIGI_STATE" type="application/json">')[1]
        .split("</script>")[0];

      return rawVideoMetadata;
    }
  }
}

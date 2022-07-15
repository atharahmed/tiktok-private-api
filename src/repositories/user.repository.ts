import qs from "qs";
import debug from "debug";
import { TikTokClient } from "../core/client";
import { Repository } from "../core/repository";
import { GenericError, UserNotfoundError } from "../errors";

import { UserRepositoryInfoResponseUserInfoRoot } from "../responses";

export class UserRepository extends Repository {
  private userDebug = debug("tiktok:user");
  private _userAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1";

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
    browser_version: this._userAgent,
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
    msToken:
      "zeKJo6iucFiMvbscBo_w-4NMbuljK2u22uf5AgTNdeY85HGODm-QMx5J87Xhwd8bHSXMOZoKpufVijsEoiC21pzUuiM7PGo6cS0isipRE21d9ocsso03lVfTEv4xFYwOxwB8rkjcSEe-sfRKoA==",
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
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    };
    const response = await this.client.request.send(url, headers);

    console.log(response.body);

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
    const ttCsrfToken = this.client.helper.generateCsrfToken();

    const query = {
      ...this._defaultApiParams,
      id: id,
      secUid: secUid,
      count: count,
      cursor: cursor,
      device_id: deviceId,
      history_len: this.client.helper.getRandomInt(1, 5),
    };

    const url = `https://m.tiktok.com/api/post/item_list/?${qs.stringify(
      query
    )}`;

    const signature = this.client.signer.sign(url, this._userAgent);

    const finalUrl = url + `&_signature=${signature}`;

    this.userDebug(`Generated signed url ${finalUrl}`);

    const xTTParams = this.client.signer.ttParams(
      { ...query, _signature: signature },
      this._userAgent
    );

    const r = await this.client.request.send(
      finalUrl,
      { "x-secsdk-csrf-version": "1.2.5", "x-secsdk-csrf-request": "1" },
      "HEAD"
    );

    const csrfToken =
      r.headers && r.headers["x-ware-csrf-token"]
        ? r.headers["x-ware-csrf-token"].toString().split(",")[1]
        : "";

    const csrf_session_id = this.client.helper.getCookieValue(
      r.headers["set-cookie"],
      "csrf_session_id"
    );

    const headers = {
      accept: "application/json, text/plain, */*",
      "accept-encoding": "gzip",
      "accept-language": "en-US,en;q=0.9",
      origin: "https://www.tiktok.com",
      referer: "https://www.tiktok.com/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "none",
      "sec-gpc": "1",
      "user-agent": this._userAgent,
      "x-secsdk-csrf-token": csrfToken,
      "x-tt-params": xTTParams,
      cookie: `csrf_session_id=${csrf_session_id}; tt_csrf_token=${ttCsrfToken}; tt_webid=${deviceId}; tt_webid_v2=${deviceId}; ttwid`,
    };

    const response = await this.client.request.send(finalUrl, headers);

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

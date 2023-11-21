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
    count: 30,
    secUid: null,
    cursor: 0,
    cookie_enabled: true,
    screen_width: 0,
    screen_height: 0,
    browser_language: "",
    browser_platform: "",
    browser_name: "",
    browser_version: "",
    browser_online: "",
    timezone_name: "Europe/London",
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

    const response = await this.client.request.send(
      url,
      this.client.state.defaultHeaders
    );

    const parsed = await this.parseHtmlContent(response.body);

    if (parsed) {
      const obj = JSON.parse(parsed.data);

      if (parsed.sigiState) {
        const userModule = obj["UserModule"];
        const itemModule = obj["ItemModule"];

        return {
          userInfo: {
            ...userModule.users[username],
            stats: userModule.stats[username],
            itemList: Object.values(itemModule),
          },
          seoProps: {
            metaParams:
              obj && obj["SEOState"]
                ? obj["SEOState"]["metaParams"]
                : obj && obj["SEO"]
                ? obj["SEO"]["metaParams"]
                : [],
          },
        };
      }

      if (
        obj["__DEFAULT_SCOPE__"] &&
        obj["__DEFAULT_SCOPE__"]["webapp.user-detail"]
      ) {
        const userModule =
          obj["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"];
        return {
          userInfo: {
            ...userModule.user,
            stats: userModule.stats,
            itemList: userModule.itemList,
          },
          seoProps: {},
        };
      }
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
    // const deviceId = this.client.helper.generateDeviceId();

    // let url = new URL(
    //   `https://m.tiktok.com/api/post/item_list/?${qs.stringify({
    //     ...this._defaultApiParams,
    //     id: id,
    //     secUid: secUid,
    //     count: count,
    //     cursor: cursor,
    //     device_id: deviceId,
    //     history_len: this.client.helper.getRandomInt(1, 5),
    //   })}`
    // );

    // const signature = this.client.signer.sign(url.toString());

    // url.searchParams.append("_signature", signature);

    // this.userDebug(`Generated signed url ${url.toString()}`);

    // const bogus = this.client.signer.bogus(url.searchParams.toString());

    // url.searchParams.append("X-bogus", bogus);

    // this.userDebug(`Generated bogus url ${url}`);

    const xTTParams = this.client.signer.xttparams(
      qs.stringify({
        ...this._defaultApiParams,
        secUid: secUid,
        cursor: cursor,
        count: count,
        is_encryption: 1,
      })
    );

    const response = await this.client.request.send(
      "https://www.tiktok.com/api/post/item_list/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=1&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F107.0.0.0%20Safari%2F537.36%20Edg%2F107.0.1418.35&channel=tiktok_web&cookie_enabled=true&device_id=7002566096994190854&device_platform=web_pc&focus_state=false&from_page=user&history_len=3&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=RO&referer=https%3A%2F%2Fexportcomments.com%2F&region=RO&root_referer=https%3A%2F%2Fexportcomments.com%2F&screen_height=1440&screen_width=2560&tz_name=Europe%2FBucharest&verifyFp=verify_lacphy8d_z2ux9idt_xdmu_4gKb_9nng_NNTTTvsFS8ao&webcast_language=en&msToken=7UfjxOYL5mVC8QFOKQRhmLR3pCjoxewuwxtfFIcPweqC05Q6C_qjW-5Ba6_fE5-fkZc0wkLSWaaesA4CZ0LAqRrXSL8b88jGvEjbZPwLIPnHeyQq6VifzyKf5oGCQNw_W4Xq12Q-8KCuyiKGLOw=&X-Bogus=DFSzswVL-XGANHVWS0OnS2XyYJUm&_signature=_02B4Z6wo00001Pf0DlwAAIDB1FUg8jgaqOz39ArAAF6Z72",
      {
        ...this.client.state.defaultApiHeaders,
        "x-tt-params": xTTParams,
      }
    );

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

      return {
        sigiState: true,
        data: rawVideoMetadata,
      };
    }

    if (content.includes("__UNIVERSAL_DATA_FOR_REHYDRATION__")) {
      const rawVideoMetadata = content
        .split(
          '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">'
        )[1]
        .split("</script>")[0];

      return {
        sigiState: false,
        data: rawVideoMetadata,
      };
    }
  }
}

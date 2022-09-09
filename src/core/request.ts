import got, {
  Method,
  OptionsOfTextResponseBody,
  HTTPError,
  RequestError,
  TimeoutError,
} from "got-cjs";
import { HttpProxyAgent, HttpsProxyAgent } from "hpagent";
import http2 from "http2-wrapper";

import { TikTokClient } from "./client";

import {
  UserNotfoundError,
  HTTPError as TikTokHttpError,
  NetworkError,
} from "../errors";

export class Request {
  constructor(private client: TikTokClient) {}

  defaults: Partial<OptionsOfTextResponseBody> = {
    http2: true,
  };

  async send(url: string, headers: any, method: Method = "GET") {
    if (this.client.proxy) {
      this.defaults.agent = {
        http2: new http2.proxies.Http2OverHttp({
          proxyOptions: {
            url: this.client.proxy,
          },
        }),
        http: new HttpProxyAgent({
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 256,
          maxFreeSockets: 256,
          scheduling: "lifo",
          proxy: this.client.proxy,
        }),
        https: new HttpsProxyAgent({
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 256,
          maxFreeSockets: 256,
          scheduling: "lifo",
          proxy: this.client.proxy,
        }),
      };
    }

    try {
      const res = await got(url, {
        ...this.defaults,
        headers: headers,
        method: method,
      });

      return res;
    } catch (error: any) {
      if (error instanceof HTTPError) {
        if (error.response.statusCode === 404 && url.includes("tiktok.com/@")) {
          throw new UserNotfoundError();
        }

        throw new TikTokHttpError(error.message);
      }

      if (error instanceof RequestError) {
        throw new NetworkError(error.message);
      }

      throw error;
    }
  }
}

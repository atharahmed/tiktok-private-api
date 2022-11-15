import fs from "node:fs";
import { createCipheriv } from "node:crypto";
import { JSDOM, ResourceLoader, DOMWindow } from "jsdom";

import { TikTokClient } from "../core/client";

export class SignerService {
  private _password = "webapp1.0+202106";
  private _window: DOMWindow;

  constructor(private client: TikTokClient) {
    const signature_js = fs.readFileSync(
      __dirname + "/../sdk/signature.js",
      "utf-8"
    );
    const webmssdk = fs.readFileSync(
      __dirname + "/../sdk/webmssdk.js",
      "utf-8"
    );

    const resourceLoader = new ResourceLoader({
      userAgent: this.client.state.webUserAgent,
    });

    const { window } = new JSDOM(``, {
      url: "https://www.tiktok.com/",
      referrer: "https://www.tiktok.com/",
      contentType: "text/html",
      includeNodeLocations: false,
      runScripts: "outside-only",
      pretendToBeVisual: true,
      resources: resourceLoader,
    });

    this._window = window;

    this._window.eval(signature_js.toString());
    this._window.byted_acrawler.init({
      aid: 24,
      dfp: true,
    });
    this._window.eval(webmssdk);
  }

  sign(url: string) {
    return this._window.byted_acrawler.sign({ url });
  }

  bogus(params: any) {
    return this._window._0x32d649(params);
  }

  xttparams(params: any) {
    // Encrypt query string using aes-128-cbc
    const cipher = createCipheriv(
      "aes-128-cbc",
      this._password,
      this._password
    );
    return Buffer.concat([cipher.update(params), cipher.final()]).toString(
      "base64"
    );
  }
}

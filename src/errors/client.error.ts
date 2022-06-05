export class TikTokClientError extends Error {
  constructor(message: any = "TikTok API error.") {
    super(message);

    Object.defineProperty(this, "name", {
      value: new.target.name,
      enumerable: false,
    });
  }
}

import { TikTokClientError } from "./client.error";

export class HTTPError extends TikTokClientError {
  constructor(message: string) {
    super(message);
  }
}

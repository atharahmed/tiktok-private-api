import { TikTokClientError } from "./client.error";

export class NetworkError extends TikTokClientError {
  constructor(message: string) {
    super(message);
  }
}

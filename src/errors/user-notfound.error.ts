import { TikTokClientError } from "./client.error";

export class UserNotfoundError extends TikTokClientError {
  constructor() {
    super("User with exact username not found.");
  }
}

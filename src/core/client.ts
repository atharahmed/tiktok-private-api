import { UserRepository } from "../repositories/user.repository";
import { Request } from "./request";
import { HelperService, SignerService } from "../services";

export class TikTokClient {
  proxy: string | null;
  constructor(proxy: string | null = null) {
    this.proxy = proxy;
  }

  public helper = new HelperService();
  public signer = new SignerService();
  public request = new Request(this);
  public user = new UserRepository(this);
}

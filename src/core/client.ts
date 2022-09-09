import { State } from "./state";
import { Request } from "./request";
import { HelperService, SignerService } from "../services";

import { UserRepository } from "../repositories";

export class TikTokClient {
  proxy: string | null;
  constructor(proxy: string | null = null) {
    this.proxy = proxy;
  }

  public state = new State();
  public helper = new HelperService();
  public signer = new SignerService(this);
  public request = new Request(this);
  public user = new UserRepository(this);
}

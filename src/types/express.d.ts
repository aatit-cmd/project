import { IJwtPayload } from "./gloabal.types";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

export {};
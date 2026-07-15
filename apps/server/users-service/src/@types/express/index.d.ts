import { TJwtPayload } from "@app/lib-shared-types";

declare global {
  namespace Express {
    export interface Request {
      user?: TJwtPayload;
    }
  }
}

import { IMiddleware, Middleware, Session } from "@tsed/common";

declare module "express-session" {
  interface SessionData {
    isStarted?: boolean;
  }
}

@Middleware()
export class InitSession implements IMiddleware {
  use(@Session() session: any): void {
    if (session && !session.isStarted) {
      session.isStarted = true;
    }
  }
}

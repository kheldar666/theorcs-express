import { IMiddleware, Middleware, Next, Req } from "@tsed/common";

declare module "express-session" {
  interface SessionData {
    isStarted?: boolean;
    isAuthenticated?: boolean;
  }
}

@Middleware()
export class InitSession implements IMiddleware {
  use(@Req() request: Req): void {
    if (request.session && !request.session.isStarted) {
      request.session.isStarted = true;
      request.session.isAuthenticated = false;
    }
  }
}

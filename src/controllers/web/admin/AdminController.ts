import { Controller, Get, Req, Use, View } from "@tsed/common";
import { LocalsMiddleware } from "../../../middlewares/LocalsMiddleware";
import { i18nMiddleware } from "../../../middlewares/i18nMiddleware";

@Controller("/:locale/admin/")
@Use(LocalsMiddleware)
@Use(i18nMiddleware) // Must be set here so that it executes before LocalsMiddleware
export class AdminController {
  @Get("/")
  @View("admin/index.ejs")
  get(@Req() req: Req) {}
}

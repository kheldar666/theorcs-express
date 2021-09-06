import {
  $log,
  Context,
  IMiddleware,
  Middleware,
  Req,
  Request,
} from "@tsed/common";
import { detectLocale } from "../i18n/i18n-util";
import { initRequestParametersDetector } from "typesafe-i18n/detectors";
import { Locales } from "../i18n/i18n-types";
import L from "../i18n/i18n-node";
import { NotFound } from "@tsed/exceptions";

@Middleware()
export class i18nMiddleware implements IMiddleware {
  use(@Req() req: Req, @Context() ctx: Context) {
    const locale = this.getPreferredLocale(req);
    const i18n = L[locale];
    ctx.set("i18n", i18n);
    ctx.set("locale", locale);

    $log.debug({ Context: "i18nMiddleware.use", selectedLocale: locale });
    $log.debug({ Context: "i18nMiddleware.use", TranslationFunction: i18n });

    if (req.params["locale"] && req.params["locale"] !== locale.toString()) {
      $log.debug({
        Context: "i18nMiddleware.use",
        paramLocale: req.params["locale"],
      });
      throw new NotFound(`Language "${req.params["locale"]}" Not Supported`);
    }
  }

  private getPreferredLocale = (req: Request): Locales => {
    const requestParametersDetector = initRequestParametersDetector(
      req,
      "locale"
    );

    return detectLocale(requestParametersDetector);
  };
}

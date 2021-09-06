import { Catch, ParamValidationError, PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { AbstractExceptionFilter } from "./AbstractExceptionFilter";
import localize from "ajv-i18n";

@Catch(ParamValidationError)
export class ValidationExceptionFilter extends AbstractExceptionFilter {
  async catch(exception: Exception, ctx: PlatformContext) {
    const { response, logger } = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);
    // Need to do several checking on the referer.
    // Exists or not and same domain or not.
    const referer = ctx.request.headers.referer;
    const locale = ctx.get("locale");

    localize[locale as keyof typeof localize](error.errors);

    // Give a user friendly touch to the field name
    for (const errorElement of error.errors) {
      //Remove starting "/"
      let fieldName = errorElement.instancePath.substring(
        1,
        errorElement.instancePath.length
      );
      fieldName = fieldName.replace(/([A-Z])/g, " $1");
      const prettyFieldName =
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      errorElement.message = prettyFieldName + " : " + errorElement.message;
    }

    logger.debug({
      error: error,
    });
    logger.debug({
      headers,
    });

    if (referer) {
      await ctx.request.getRequest().flash("ajvErrors", error.errors);
      response.setHeaders(headers).redirect(301, referer);
    } else {
      const html = await response.render("errors/500.ejs", {
        error: new Error("No Referer available"),
      });
      response.setHeaders(headers).status(500).body(html);
    }
  }
}

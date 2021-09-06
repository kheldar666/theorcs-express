import { Catch, ParamValidationError, PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { InvalidCredentialsException } from "../exceptions/InvalidCredentialsException";
import { AbstractExceptionFilter } from "./AbstractExceptionFilter";

@Catch(ParamValidationError, InvalidCredentialsException)
export class ValidationExceptionFilter extends AbstractExceptionFilter {
  catch(exception: Exception, ctx: PlatformContext) {
    const { response, logger } = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);
    logger.error({
      // Need to do several checking on the referer.
      // Exists or not and same domain or not.
      "ctx.request.headers.referer": ctx.request.headers.referer,
      error: error,
    });
    logger.error({
      headers,
    });
    response.setHeaders(headers).status(error.status).body(error);
  }
}

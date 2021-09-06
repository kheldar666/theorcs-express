import { Catch, PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { AbstractExceptionFilter } from "./AbstractExceptionFilter";

@Catch(Exception)
export class HttpExceptionFilter extends AbstractExceptionFilter {
  /**
   * HttpExceptionFilter is here to catch all remaining non processed exceptions
   * and return an Error 500 template
   * @param exception
   * @param ctx
   */
  async catch(exception: Exception, ctx: PlatformContext) {
    const { response, logger } = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);
    logger.error({
      error,
    });
    //response.setHeaders(headers).status(error.status).body(error);
    const result = await response.render("errors/500.ejs", { error: error });
    return response.setHeaders(headers).status(exception.status).body(result);
  }
}

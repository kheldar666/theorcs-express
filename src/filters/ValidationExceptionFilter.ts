import {
  Catch,
  ExceptionFilterMethods,
  ParamValidationError,
  PlatformContext,
  ResponseErrorObject,
} from "@tsed/common";
import { Exception } from "@tsed/exceptions";

@Catch(ParamValidationError)
export class ValidationExceptionFilter implements ExceptionFilterMethods {
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

  mapError(error: any) {
    return {
      name: error.origin?.name || error.name,
      message: error.message,
      status: error.status || 500,
      errors: this.getErrors(error),
    };
  }

  protected getErrors(error: any) {
    return [error, error.origin]
      .filter(Boolean)
      .reduce((errs, { errors }: ResponseErrorObject) => {
        return [...errs, ...(errors || [])];
      }, []);
  }

  protected getHeaders(error: any) {
    return [error, error.origin]
      .filter(Boolean)
      .reduce((obj, { headers }: ResponseErrorObject) => {
        return {
          ...obj,
          ...(headers || {}),
        };
      }, {});
  }
}

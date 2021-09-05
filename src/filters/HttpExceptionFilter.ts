import {
  Catch,
  ExceptionFilterMethods,
  PlatformContext,
  ResponseErrorObject,
} from "@tsed/common";
import { Exception } from "@tsed/exceptions";

@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilterMethods {
  async catch(exception: Exception, ctx: PlatformContext) {
    console.log("=========== HttpExceptionFilter ===============");

    console.log(exception.type);

    console.log("=========== =========== ===============");

    console.log(exception);

    console.log("=========== HttpExceptionFilter ===============");
    const { response, logger } = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);
    logger.error({
      error,
    });
    //response.setHeaders(headers).status(error.status).body(error);
    const result = await response.render("errors/500.ejs", error);
    return response.setHeaders(headers).status(exception.status).body(result);
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

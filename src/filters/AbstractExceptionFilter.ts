import {
  ExceptionFilterMethods,
  PlatformContext,
  ResponseErrorObject,
} from "@tsed/common";

export abstract class AbstractExceptionFilter
  implements ExceptionFilterMethods
{
  abstract catch(error: unknown, ctx: PlatformContext): void;

  protected mapError(error: any) {
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
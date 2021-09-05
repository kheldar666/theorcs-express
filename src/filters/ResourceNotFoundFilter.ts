import {
  $log,
  Catch,
  ExceptionFilterMethods,
  PlatformContext,
  ResourceNotFound,
} from "@tsed/common";

@Catch(ResourceNotFound)
export class ResourceNotFoundFilter implements ExceptionFilterMethods {
  async catch(exception: ResourceNotFound, ctx: PlatformContext) {
    const { response } = ctx;

    const error = {
      status: exception.status,
      message: exception.message,
      url: exception.url,
    };

    $log.debug({ Context: "ResourceNotFoundFilter.catch", error: error });

    //response.status(exception.status).body(error);
    const result = await response
      .status(exception.status)
      .render("errors/404.ejs", error);

    console.log(result);

    return result;
  }
}

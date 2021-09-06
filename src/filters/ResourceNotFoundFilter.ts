import { $log, Catch, PlatformContext, ResourceNotFound } from "@tsed/common";
import { AbstractExceptionFilter } from "./AbstractExceptionFilter";

@Catch(ResourceNotFound)
export class ResourceNotFoundFilter extends AbstractExceptionFilter {
  async catch(exception: ResourceNotFound, ctx: PlatformContext) {
    const { response } = ctx;

    const error = {
      status: exception.status,
      message: exception.message,
      url: exception.url,
    };

    $log.debug({ Context: "ResourceNotFoundFilter.catch", error: error });

    const result = await response.render("errors/404.ejs", { error: error });
    return response.status(exception.status).body(result);
  }
}

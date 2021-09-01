import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/mongoose";
import { config, rootDir } from "./config";
import helmet from "helmet";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false,
  mount: {
    "/rest": [`${rootDir}/controllers/rest/**/*.ts`],
    "/": [`${rootDir}/controllers/web/**/*.ts`],
  },
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs",
    },
  },
  statics: {
    "/": [
      {
        root: `${rootDir}/public`,
        options: { index: false, maxAge: "1d" },
      },
    ],
  },
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(helmet())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      );
  }
}

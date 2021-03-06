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
import csurf from "csurf";
import ConnectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import { flash } from "express-flash-message";
import { InitSession } from "./middlewares/InitSession";
import { FlashErrorMessage } from "./middlewares/FlashErrorMessage";
//Custom 404/500 Page
import "./filters/ResourceNotFoundFilter";
import "./filters/ValidationExceptionFilter";
import "./filters/HttpExceptionFilter";
import { UserInfo } from "@tsed/passport";
import { CspNonceMiddleware } from "./middlewares/CspNonceMiddleware";

const mongoDbSession = ConnectMongoDBSession(session);

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false,
  mount: {
    "/rest": [`${rootDir}/controllers/rest/**/*.ts`],
    "/": [`${rootDir}/controllers/web/**/*.ts`],
  },
  componentsScan: [
    `${rootDir}/services/**/**.ts`,
    `${rootDir}/middlewares/**/**.ts`,
    `${rootDir}/modules/**/**.ts`,
    `${rootDir}/protocols/**/**.ts`,
  ],
  passport: {
    userInfoModel: UserInfo,
  },
  ajv: {
    errorFormatter: (error) =>
      `At ${error.modelName}${error.schemaPath}, value '${error.data}' ${error.message}`,
    verbose: false,
    allErrors: true,
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
        options: {
          index: false,
          maxAge: "1d",
        },
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
    /**
     * cf. http://expressjs.com/en/guide/behind-proxies.html
     */
    this.app.getApp().set("trust proxy", process.env.TRUST_PROXY || 1);

    this.app
      .use(cors())
      .use(CspNonceMiddleware)
      .use(
        helmet({
          //Necessary for ValidationExceptionFilter to work properly
          referrerPolicy: { policy: "same-origin" },
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              scriptSrc: [
                "'self'",
                //@ts-ignore
                (req, res) => `'nonce-${res.locals.cspNonce}'`,
              ],
            },
          },
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json({ limit: process.env.MAX_REQUEST_SIZE }))
      .use(
        bodyParser.urlencoded({
          extended: true,
          limit: process.env.MAX_REQUEST_SIZE,
        })
      )
      .use(
        session({
          secret: process.env.SESSION_SECRET || "changeme",
          resave: false,
          saveUninitialized: false,
          store: new mongoDbSession({
            uri:
              process.env.MONGODB_CONNECTION_STRING ||
              "mongodb://localhost:27017/default",
            collection: "sessions",
          }),
        })
      )
      .use(flash({ sessionKeyName: "flashMessage" }))
      .use(csurf())
      .use(InitSession)
      .use(FlashErrorMessage);
  }
}

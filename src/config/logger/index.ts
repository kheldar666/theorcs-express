import { $log, PlatformLoggerSettings } from "@tsed/common";
import { isProduction } from "../env";
import { LogLevel } from "./LogLevel";

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json",
    },
  });

  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json",
    },
  });
}

export const loggerConfig: Partial<PlatformLoggerSettings> = {
  disableRoutesSummary: isProduction,

  level: process.env.LOG_LEVEL
      ? LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel]
      : "info",
};

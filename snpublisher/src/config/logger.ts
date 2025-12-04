import { createLogger, format, transport, transports } from "winston";
import { envs } from "./envs.plugin";
import { LogEntity } from "../domain";

const loggerTransports: transport[] = [
  new transports.File({ filename: "logs/combined.log" }),
  new transports.File({ filename: "logs/error.log", level: "error" }),
];

if (envs.NODE_ENV !== "production") {
  loggerTransports.push(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

const winstonLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: loggerTransports,
});

type LogMeta = Pick<LogEntity, "context">;

type LogMethod = (message: string, meta: LogMeta) => void;

export const loggerFactory =
  (traceId: string) =>
  (module: string): Record<"info" | "warn" | "error", LogMethod> => ({
    info: (message, meta) =>
      winstonLogger.info(message, { ...meta, module, traceId }),
    warn: (message, meta) =>
      winstonLogger.warn(message, { ...meta, module, traceId }),
    error: (message, meta) =>
      winstonLogger.error(message, { ...meta, module, traceId }),
  });

export type FactoryLogger = typeof loggerFactory;
export type CreateLogger = ReturnType<typeof loggerFactory>;
export type Logger = ReturnType<ReturnType<typeof loggerFactory>>;

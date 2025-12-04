import "dotenv/config";
import { get } from "env-var";

export const envs = {
  NODE_ENV: get("NODE_ENV").default("production").asString(),
  PORT: get("PORT").default(80).asPortNumber(),
  DATABASE_URL: get("DATABASE_URL").required().asString(),
  SELF_URL: get("SELF_URL").required().asString(),
  ORIGIN: get("ORIGIN").required().asString(),
};

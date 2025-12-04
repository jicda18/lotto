import { PrismaClient } from "@prisma/client";
import { CreateLogger, envs } from "./config";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  const prisma = new PrismaClient();
  const makeLogger = CreateLogger;

  const server = new Server({
    port: envs.PORT,
    origin: envs.ORIGIN,
    routes: AppRoutes.routes(prisma, makeLogger),
  });

  server.start();
}

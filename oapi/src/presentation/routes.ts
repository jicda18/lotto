import { Router } from "express";
import { Client, MakeLogger } from "../config";
import {
  GameController,
  LotteryController,
  ResultController,
} from "../infrastructure/controllers";

export class AppRoutes {
  static routes(client: Client, makeLogger: MakeLogger): Router {
    const router = Router();

    const lotteryController = new LotteryController(client, makeLogger);
    router.get("/lotteries", lotteryController.index);
    router.get("/lotteries/:id", lotteryController.show);

    const gameController = new GameController(client, makeLogger);
    router.get("/lotteries/:lotteryId/games", gameController.index);
    router.get("/games/:id", gameController.show);

    const resultController = new ResultController(client, makeLogger);
    router.get("/games/:gameId/results", resultController.index);
    router.get("/games/:gameId/results/:dte", resultController.show);

    router.get("/health", (req, res) => {
      res.status(200).json({ status: "OK" });
    });

    return router;
  }
}

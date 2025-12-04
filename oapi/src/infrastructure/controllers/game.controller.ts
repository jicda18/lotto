import { Request, Response } from "express";
import { Responser } from "../../config/responser";
import {
  Client,
  isValidUUID,
  Logger,
  MakeLogger,
  PaginationParams,
} from "../../config";
import { GameResource } from "../../domain/resources";

export class GameController {
  private logger: Logger;

  constructor(private client: Client, makeLogger: MakeLogger) {
    this.logger = makeLogger("game.controller.ts");
  }

  public index = async (req: Request, res: Response) => {
    const { lotteryId } = req.params;

    try {
      const { page, limit, skip } = PaginationParams(req);

      const search = isValidUUID(lotteryId)
        ? { id: lotteryId }
        : { slug: lotteryId };
      const where = {
        deletedAt: null,
        lottery: {
          ...search,
        },
      };
      const [entries, total] = await Promise.all([
        await this.client.game.findMany({
          skip,
          take: limit,
          orderBy: { id: "asc" },
          where,
        }),
        this.client.game.count({ where }),
      ]);

      Responser.paginate({
        res,
        path: req.path,
        entries: entries.map(GameResource),
        total,
        limit,
        page,
      });
    } catch (error) {
      const msg = "Internal server error";
      this.logger.error(msg, { context: { error } });

      Responser.error(res, msg, 500);
    }
  };

  public show = async (req: Request, res: Response) => {
    const { id } = req.params;

    const search = isValidUUID(id) ? { id } : { slug: id };

    const game = await this.client.game.findFirst({
      where: {
        deletedAt: null,
        ...search,
      },
    });

    if (game) return Responser.success(res, GameResource(game));

    Responser.error(res, `Game: ${id}' doesn't exists`, 404);
  };
}

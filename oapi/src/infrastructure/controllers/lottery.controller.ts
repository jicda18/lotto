import { Request, Response } from "express";
import { Responser } from "../../config/responser";
import {
  Client,
  isValidUUID,
  Logger,
  MakeLogger,
  PaginationParams,
} from "../../config";
import { LotteryResource } from "../../domain/resources";

export class LotteryController {
  private logger: Logger;

  constructor(private client: Client, makeLogger: MakeLogger) {
    this.logger = makeLogger("lottery.controller.ts");
  }

  public index = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = PaginationParams(req);

      const where = { deletedAt: null };
      const [entries, total] = await Promise.all([
        this.client.lottery.findMany({
          skip,
          take: limit,
          orderBy: { id: "asc" },
          where,
        }),
        this.client.lottery.count({ where }),
      ]);

      Responser.paginate({
        res,
        path: req.path,
        entries: entries.map(LotteryResource),
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

    const lottery = await this.client.lottery.findFirst({
      where: {
        deletedAt: null,
        ...search,
      },
    });

    if (lottery) return Responser.success(res, LotteryResource(lottery));

    Responser.error(res, `Lottery: '${id}' doesn't exists`, 404);
  };
}

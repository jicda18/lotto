import { Request, Response } from "express";
import { Responser } from "../../config/responser";
import {
  Client,
  isValidUUID,
  Logger,
  LuxonAdapter,
  MakeLogger,
  PaginationParams,
} from "../../config";
import { GroupedResultResource } from "../../domain/resources";
import { GroupedResult } from "../../domain/entities/grouped-result.entity";

type ResultWithTotal = GroupedResult & { total: bigint };

export class ResultController {
  private logger: Logger;

  constructor(private client: Client, makeLogger: MakeLogger) {
    this.logger = makeLogger("result.controller.ts");
  }

  public index = async (req: Request, res: Response) => {
    const { gameId } = req.params;

    try {
      const { page, limit, skip } = PaginationParams(req);

      const isUuid = isValidUUID(gameId);
      const uuidValue = isUuid ? gameId : null;
      const slugValue = isUuid ? null : gameId;

      const results = await this.client.$queryRaw<ResultWithTotal[]>`
        WITH grouped AS (
          SELECT
            r."gameId",
            r."eventTime",
            array_agg(r."result" ORDER BY r."position") AS results,
            MIN(r."createdAt") AS createdAt
          FROM "results" r JOIN "games" g ON g."id" = r."gameId"
          WHERE r."deletedAt" IS NULL AND g."deletedAt" IS NULL AND (g."id" = ${uuidValue}::uuid OR g."slug" = ${slugValue})
          GROUP BY r."gameId", r."eventTime"
        )
        SELECT *, COUNT(*) OVER () AS total FROM grouped ORDER BY "eventTime" DESC LIMIT ${limit} OFFSET ${skip};
      `;
      const total: number = results.length > 0 ? Number(results[0].total) : 0;

      Responser.paginate({
        res,
        path: req.path,
        entries: results.map(({ total, ...result }) =>
          GroupedResultResource(result)
        ),
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
    const { gameId, dte } = req.params;

    try {
      const dt1 = LuxonAdapter.startOf(dte, "day");
      const dt2 = LuxonAdapter.endof(dt1, "day");

      const isUuid = isValidUUID(gameId);
      const uuidValue = isUuid ? gameId : null;
      const slugValue = isUuid ? null : gameId;

      const results = await this.client.$queryRaw<GroupedResult[]>`
        SELECT
          r."gameId",
          r."eventTime",
          array_agg(r."result" ORDER BY r."position") AS results,
          MIN(r."createdAt") AS createdAt
        FROM "results" r JOIN "games" g ON g."id" = r."gameId"
        WHERE
          r."deletedAt" IS NULL
          AND g."deletedAt" IS NULL
          AND (g."id" = ${uuidValue}::uuid OR g."slug" = ${slugValue})
          AND r."eventTime" between ${dt1} AND ${dt2}
        GROUP BY r."gameId", r."eventTime"
        `;

      const result = results.find(() => true);

      Responser.success(res, result ? GroupedResultResource(result) : null);
    } catch (error) {
      const msg = "Internal server error";
      this.logger.error(msg, { context: { error } });

      Responser.error(res, msg, 500);
    }
  };
}

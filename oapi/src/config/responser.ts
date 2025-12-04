import { Response } from "express";
import { SelfHelper } from "./self-helper";

export const Responser = {
  success: (res: Response, entries: unknown, code: number = 200) => {
    res.status(code).json({
      success: true,
      entries,
    });
  },
  error: (res: Response, error: string, code: number = 200) => {
    res.status(code).json({
      success: false,
      error,
    });
  },
  paginate: ({
    res,
    path,
    entries,
    page,
    limit,
    total,
  }: {
    res: Response;
    path: string;
    entries: unknown[];
    page: number;
    limit: number;
    total: number;
  }) => {
    const totalPages = Math.ceil(total / limit);

    const links: Record<string, string> = {
      self: SelfHelper.MakeUrl(`${path}?page=${page}&limit=${limit}`),
      first: SelfHelper.MakeUrl(`${path}?page=1&limit=${limit}`),
      last: SelfHelper.MakeUrl(`${path}?page=${totalPages}&limit=${limit}`),
    };

    if (page > 1) {
      links.prev = SelfHelper.MakeUrl(
        `${path}?page=${page - 1}&limit=${limit}`
      );
    }

    if (page < totalPages) {
      links.next = SelfHelper.MakeUrl(
        `${path}?page=${page + 1}&limit=${limit}`
      );
    }

    res.json({
      success: true,
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      links,
    });
  },
};

import { Request } from "express";

export const PaginationParams = (req: Request) => {
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = parseInt(req.query.limit?.toString() ?? "16");
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

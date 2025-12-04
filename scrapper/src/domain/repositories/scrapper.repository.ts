import { BrowserPage, CreateLogger } from "../../config";

export type Scrapper<
  T = {
    [key: string]: unknown;
  }
> = (
  dte: Date,
  options: T,
  page: BrowserPage,
  CreateLogger: CreateLogger
) => Promise<(number | string)[]>;

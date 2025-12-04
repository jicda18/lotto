import { JsonValue } from "./generic";
import { Lottery } from "./lottery.entity";
import { Result } from "./result.entity";

export interface Game {
  id: string;
  lotteryId: string;
  name: string;
  slug: string;
  logo: string | null;
  wrapRepository: string;
  options: JsonValue;
  resultTime: string;
  resultRenderComponent: string;
  createdAt: Date;
  deletedAt: Date | null;

  lottery?: Lottery;
  results?: Result[];
}

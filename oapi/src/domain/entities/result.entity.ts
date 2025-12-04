import { Game } from "./game.entity";

export interface Result {
  gameId: string;
  eventTime: Date;
  position: number;
  result: string;
  createdAt: Date;
  deletedAt: Date | null;

  game?: Game;
}

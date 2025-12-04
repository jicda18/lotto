import { Game } from "./game.entity";

export type GameTask = Game & { searchDate: Date; traceId: string };

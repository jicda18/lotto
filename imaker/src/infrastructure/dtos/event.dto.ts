import { LuxonAdapter } from "../../config";
import { EventEntity } from "../../domian";

export class EventDTO {
  public gameId: string;
  public lotteryId: string;
  public traceId: string;
  public results: (string | number)[];
  public dte: Date;

  constructor(event: EventEntity) {
    this.gameId = event.gameId;
    this.lotteryId = event.lotteryId;
    this.traceId = event.traceId;
    this.results = JSON.parse(event.results);
    this.dte = LuxonAdapter.toDate(event.dte);
  }
}

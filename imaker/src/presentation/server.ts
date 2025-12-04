import { loggerFactory } from "../config";
import {
  ConsumerRepository,
  Publisher,
  ResourcesRepository,
  SaverRepository,
} from "../domian";
import {
  CanvasDrawerRepository,
  EventDTO,
  ImagesBuffers,
} from "../infrastructure";
import { MakerService } from "./maker/maker.service";

export type PublisherEvent = {
  v045: string;
  v916: string;
  v169: string;
  v191: string;
  lotteryId: string;
  gameId: string;
  dte: string;
};
export class Server {
  private running: boolean = false;

  constructor(
    private consumer: ConsumerRepository,
    private publisher: Publisher<PublisherEvent>,
    private resources: ResourcesRepository,
    private saver: SaverRepository<ImagesBuffers>
  ) {}

  public async start() {
    console.log("Server is starting...");
    this.running = true;

    process.on("SIGINT", () => {
      this.running = false;

      this.consumer.disconect();
      this.publisher.disconect();
    });

    while (this.running) {
      await this.consumer.consume(async (data) => {
        const CreateLogger = loggerFactory(data.traceId);

        const logger = CreateLogger("server.ts");

        logger.info("Received event from consumer", { context: { data } });

        const event = await MakerService(
          new EventDTO(data),
          this.resources,
          new CanvasDrawerRepository(CreateLogger),
          this.saver,
          CreateLogger
        );

        if (event) {
          logger.info("Publishing event", { context: { event } });
          await this.publisher.publish(event);
        }
      });
    }
  }
}

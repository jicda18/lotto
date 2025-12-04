import { loggerFactory } from "../config";
import { ConsumerRepository, PublisherRepository, ResourcesRepository } from "../domain";
import { ProcessEventUseCases } from "../infrastructure/use-cases/process-event.use-cases";

export class Server {
  private running: boolean = false;

  constructor(private consumer: ConsumerRepository, private resources: ResourcesRepository, private publishers: PublisherRepository[]) {}

  public async start() {
    console.log("Server is starting...");
    this.running = true;

    process.on("SIGINT", () => {
      this.running = false;

      this.consumer.disconect();
    });

    while (this.running) {
      await this.consumer.consume((data) => {
        const CreateLogger = loggerFactory(data.traceId);

        const logger = CreateLogger("server.ts");

        logger.info("Received event from consumer", { context: { data } });

        return ProcessEventUseCases(data, this.resources, this.publishers, CreateLogger);
      });
    }
  }
}

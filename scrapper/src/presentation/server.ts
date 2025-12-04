import puppeteer from "puppeteer";
import { Task, Worker, GameTask, QueueRepository, Publisher } from "../domain";
import { PrismaClient } from "@prisma/client";
import {
  CronService,
  GameService,
  Job,
  ProcessorPublisherEvent,
  ProcessorService,
} from "./";
import { loggerFactory, generateUUID } from "../config";
import { RedisPublisher, RedisQueueRepository } from "../infrastructure";

const prisma = new PrismaClient();
export class Server {
  private jobs: Job[] = [];
  private queueWorkers: Worker[] = [];
  private publisher: Publisher<ProcessorPublisherEvent>;

  constructor(
    private wsEndpoint: string,
    private redisHost: string,
    private redisPort: number,
    private queueName: string,
    private backgroundQueueName: string,
    private queueConcurrency: number,
    private eventName: string
  ) {
    this.publisher = new RedisPublisher<ProcessorPublisherEvent>(
      this.redisHost,
      this.redisPort,
      this.eventName
    );
  }

  private startQueueWorker<T>(
    queue: QueueRepository<T>,
    processor: (job: Task<T>) => Promise<void>
  ) {
    this.queueWorkers.push(queue.start(processor, this.queueConcurrency));
  }

  private workerProcessor = async (job: Task<GameTask>) => {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.wsEndpoint,
    });

    const processor = new ProcessorService(
      browser,
      prisma,
      this.publisher,
      loggerFactory
    );

    await processor.gameProcessor(job);

    await browser.close();
  };

  public async start() {
    console.log("Server is starting...");
    const traceId = generateUUID();
    const CreateLogger = loggerFactory(traceId);

    const queue = new RedisQueueRepository<GameTask>(
      this.redisHost,
      this.redisPort,
      this.queueName,
      CreateLogger
    );

    const backgroundQueue = new RedisQueueRepository<GameTask>(
      this.redisHost,
      this.redisPort,
      this.backgroundQueueName,
      CreateLogger
    );

    this.jobs.push(
      CronService.createStartedJob("0 * * * * *", () => {
        GameService(prisma, queue, loggerFactory);
      })
    );

    this.startQueueWorker<GameTask>(queue, this.workerProcessor);

    this.startQueueWorker<GameTask>(backgroundQueue, this.workerProcessor);
  }

  public async end() {
    await Promise.all([
      ...this.jobs.map((job) => job.stop()),
      ...this.queueWorkers.map((worker) => worker.close()),
      prisma.$disconnect(),
      this.publisher.disconect(),
    ]);
  }
}

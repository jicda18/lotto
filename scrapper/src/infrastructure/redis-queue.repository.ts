import { Worker as BullmqWorker, Queue as BullmqQueue } from "bullmq";
import { CreateLogger, Logger } from "../config/plugins/logger";
import { Worker, Task, QueueRepository } from "../domain";

export class RedisQueueRepository<T> implements QueueRepository<T> {
  private logger: Logger;

  constructor(
    private host: string,
    private port: number,
    private readonly queueName: string,
    CreateLogger: CreateLogger
  ) {
    this.logger = CreateLogger("queue.repository.ts");
  }

  start = (
    processor: (job: Task<T>) => Promise<void>,
    concurrency: number
  ): Worker => {
    this.logger.info(`Starting worker for queue: ${this.queueName}`, {});

    return new BullmqWorker(this.queueName, processor, {
      concurrency,
      lockDuration: 60 * 1000, // 1 Minute
      connection: { host: this.host, port: this.port },
    });
  };

  addTask = async (name: string, param: T, delay?: number) => {
    this.logger.info(`Adding task to queue: ${name}`, {
      context: { name, param, delay },
    });

    const queue = new BullmqQueue(this.queueName, {
      connection: {
        host: this.host,
        port: this.port,
        maxRetriesPerRequest: null,
      },
    });

    await queue.add(name, param, {
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
        count: 1000, // keep up to 1000 jobs
      },
      removeOnFail: {
        age: 24 * 3600, // keep up to 24 hours
      },
      delay,
    });

    await queue.close();
  };

  static summary = async (host: string, port: number, queueName: string) => {
    const queue = new BullmqQueue(queueName, {
      connection: {
        host: host,
        port: port,
        maxRetriesPerRequest: null,
      },
    });

    const summary = await queue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed"
    );

    await queue.close();

    return summary as {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
  };
}

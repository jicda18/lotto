import { CronJob } from "cron";

type CronTime = string | Date;
type Tick = () => void;
export interface Job {
  start(): void;
  stop(): Promise<void> | undefined;
}

export class CronService {
  public static createJob(cronTime: CronTime, onTick: Tick): Job {
    const job = new CronJob(cronTime, onTick);

    return job;
  }

  public static createStartedJob(cronTime: CronTime, onTick: Tick): Job {
    const job = new CronJob(cronTime, onTick);

    job.start();

    return job;
  }
}

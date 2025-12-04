import { CreateLogger } from "../../config";

export interface Worker {
  pause(doNotWaitActive?: boolean): Promise<void>;
  resume(): void;
  isPaused(): boolean;
  isRunning(): boolean;
  close(force?: boolean): Promise<void>;
}

export interface Task<T> {
  name: string;
  data: T;
  id?: string;
}

export interface QueueSummary {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface QueueRepository<T> {
  start(
    processor: (job: Task<T>) => Promise<void>,
    concurrency: number
  ): Worker;

  addTask(name: string, param: T, delay?: number): Promise<void>;
}

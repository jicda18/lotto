import Redis from "ioredis";
import { Publisher } from "../../domian";

export class RedisPublisher<
  T extends Record<string, string | number>
> extends Publisher<T> {
  private _redis: Redis;

  constructor(host: string, port: number, name: string) {
    super(name);

    this._redis = new Redis({ host, port });
  }

  publish(event: T): Promise<string | null> {
    return this._redis.xadd(this.name, "*", ...Object.entries(event).flat());
  }

  async disconect() {
    this._redis.disconnect();
  }
}

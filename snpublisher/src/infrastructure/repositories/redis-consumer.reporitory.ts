import Redis from "ioredis";
import { ConsumerRepository, EventEntity } from "../../domain";

export class RedisConsumerRepository extends ConsumerRepository {
  private _redis: Redis;
  private lastId: string = "$";

  constructor(host: string, port: number, name: string) {
    super(name);

    this._redis = new Redis({ host, port });
  }

  async consume(callback: (data: EventEntity) => Promise<void>): Promise<void> {
    console.log("Waiting new event...");

    const streams = await this._redis.xread(
      "BLOCK",
      0,
      "STREAMS",
      this.name,
      this.lastId
    );

    if (streams) {
      for (const [_, messages] of streams) {
        for (const [id, fields] of messages) {
          const data = fields.reduce<Record<string, string>>((acc, cur, i) => {
            if (i % 2 === 0) {
              acc[cur] = fields[i + 1];
            }

            return acc;
          }, {});

          // await is not used so that the wait for the next event in the stream starts as soon as possible. The process runs in the "background."
          callback(data as unknown as EventEntity);
          this.lastId = id;
        }
      }
    }
  }

  async disconect() {
    this._redis.disconnect();
  }
}

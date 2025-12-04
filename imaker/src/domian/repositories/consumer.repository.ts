import { EventEntity } from "../entities";

export abstract class ConsumerRepository {
  constructor(protected name: string) {}

  abstract consume(
    callback: (data: EventEntity) => Promise<void>
  ): Promise<void>;

  abstract disconect(): Promise<void>;
}

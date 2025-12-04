export abstract class Publisher<T extends Record<string, string | number>> {
  constructor(protected name: string) {}

  abstract publish(event: T): Promise<string | null>;

  abstract disconect(): Promise<void>;
}

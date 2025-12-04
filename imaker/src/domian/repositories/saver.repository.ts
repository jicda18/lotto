export interface SaverRepository<
  T extends Record<string, NodeJS.ArrayBufferView>
> {
  save(buffers: T): Promise<{ [K in keyof T]: string }>;
}

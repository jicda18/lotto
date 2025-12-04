import fs from "fs";

import { generateUUID } from "../../config";
import { SaverRepository } from "../../domian";

export class LocalSaverRepository<
  T extends Record<string, NodeJS.ArrayBufferView>
> implements SaverRepository<T>
{
  async save(buffers: T): Promise<{ [K in keyof T]: string }> {
    const urlEntries = await Promise.all(
      Object.entries(buffers).map(
        async ([key, buffer]): Promise<[keyof T, string]> => {
          const outputPath = `./temp/${generateUUID()}.png`;
          // const outputPath = `./temp/${key}.png`;

          fs.writeFileSync(outputPath, buffer);

          return [key, outputPath];
        }
      )
    );

    return Object.fromEntries(urlEntries) as { [K in keyof T]: string };
  }
}

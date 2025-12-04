import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SaverRepository } from "../../domian";
import { generateUUID } from "../../config";

export class S3ContaboSaverRepository<
  T extends Record<string, NodeJS.ArrayBufferView>
> implements SaverRepository<T>
{
  private s3: S3Client;
  private folder: string;
  private bucket: string;
  private endpoint: string;
  private tenantId: string;

  constructor(data: {
    endpoint: string;
    region: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    tenantId: string;
    folder?: string;
  }) {
    this.s3 = new S3Client({
      endpoint: data.endpoint,
      forcePathStyle: true,
      region: data.region,
      credentials: {
        accessKeyId: data.accessKey,
        secretAccessKey: data.secretKey,
      },
    });

    this.endpoint = data.endpoint;
    this.bucket = data.bucket;
    this.tenantId = data.tenantId;
    this.folder = data.folder || "results";
  }

  async save(buffers: T): Promise<{ [K in keyof T]: string }> {
    const urlEntries = await Promise.all(
      Object.entries(buffers).map(
        async ([key, data]): Promise<[keyof T, string]> => {
          const aswKey = `${this.folder}/${generateUUID()}.png`;

          const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: aswKey,
            Body: Buffer.from(data.buffer, data.byteOffset, data.byteLength),
            ContentType: "image/png",
          });

          await this.s3.send(command);

          return [
            key,
            `${this.endpoint}/${this.tenantId}:${this.bucket}/${aswKey}`,
          ];
        }
      )
    );

    return Object.fromEntries(urlEntries) as { [K in keyof T]: string };
  }
}

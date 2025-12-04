import { log } from "console";
import { CreateLogger, Logger } from "../../config";
import { Game, Lottery, PublisherRepository } from "../../domain";

export class FBPublisherRepository extends PublisherRepository {
  constructor(
    private pageID: string,
    private pageToken: string,
    private apiVersion: string
  ) {
    super("v191");
  }

  async publish(
    description: string,
    lottery: Lottery,
    game: Game,
    createLogger: CreateLogger,
    imageUrl?: string
  ): Promise<void> {
    const logger = createLogger("fb-publisher.repository.ts");

    logger.info("Publishing to Facebook", {
      context: { description, lottery, game, imageUrl },
    });

    const photoId = imageUrl
      ? await this.uploadImage(
          imageUrl,
          `Resultados ${lottery.name} - ${game.name}`,
          logger
        )
      : undefined;
    logger.info("Uploaded image to Facebook", { context: { photoId } });

    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pageID}/feed?access_token=${this.pageToken}`;

    const body: Record<string, any> = {
      message: description,
    };
    if (photoId) {
      body.attached_media = [{ media_fbid: photoId }];
    }

    try {
      logger.info("Creating Facebook post", { context: { body } });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      logger.info("Facebook post created", { context: { data } });
    } catch (error) {
      logger.error("Error publishing to Facebook", { context: { error } });
    }
  }

  private async uploadImage(
    imageUrl: string,
    caption: string,
    logger: Logger
  ): Promise<string | undefined> {
    logger.info("Uploading image to Facebook", {
      context: { imageUrl, caption },
    });

    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pageID}/photos?access_token=${this.pageToken}`;

    try {
      logger.info("Fetching image", { context: { imageUrl } });
      const response = await fetch(imageUrl);

      if (!response.ok) {
        logger.error("Error fetching image", {
          context: { imageUrl, status: response.status },
        });

        return;
      }

      logger.info("Image fetched", { context: { imageUrl } });

      const arrayBuffer = await response.arrayBuffer();

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("published", "false");
      formData.append(
        "source",
        new Blob([Buffer.from(arrayBuffer)], { type: "image/png" }),
        "image.png"
      );

      logger.info("Uploading image to Facebook Graph API", {
        context: { url },
      });
      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const responseText = await uploadResponse.text();
        logger.error("Error uploading image", {
          context: {
            imageUrl,
            url,
            status: uploadResponse.status,
            responseText,
          },
        });

        return;
      }

      const data = await uploadResponse.json();
      logger.info("Image uploaded to Facebook", {
        context: { imageUrl, data },
      });

      return data.id;
    } catch (error) {
      logger.error("Error uploading image to Facebook", {
        context: { imageUrl, error },
      });
    }
  }
}

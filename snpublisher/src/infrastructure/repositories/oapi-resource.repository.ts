import { CreateLogger } from "../../config";
import { Game, Lottery, ResourcesRepository } from "../../domain";

export class OapiResourceRepository implements ResourcesRepository {
  constructor(private oapiBaseUrl: string) {}

  private async request<T>(
    method: string,
    endpoint: string,
    createLogger: CreateLogger
  ): Promise<T | null> {
    const logger = createLogger("oapi-resource.repository.ts");

    const url = `${this.oapiBaseUrl}/${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `HTTP ${response.status} - ${response.statusText}: ${errorText}`
        );
      }

      // Intentamos parsear la respuesta como JSON
      const data = (await response.json()) as
        | { success: false; error: string }
        | { success: true; entries: T };

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.entries;
    } catch (error) {
      logger.error("Error during API request", {
        context: { url, method, error },
      });
    }

    return null;
  }

  getLottery(
    lotteryId: string,
    createLogger: CreateLogger
  ): Promise<Lottery | null> {
    return this.request<Lottery>("GET", `lotteries/${lotteryId}`, createLogger);
  }

  getGame(gameId: string, createLogger: CreateLogger): Promise<Game | null> {
    return this.request<Game>("GET", `games/${gameId}`, createLogger);
  }
}

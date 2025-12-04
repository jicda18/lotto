type JsonObject = { [Key in string]?: JsonValue };
type JsonValue = string | number | boolean | JsonObject | JsonArray | null;
type JsonArray = Array<JsonValue>;

export interface Game {
  id: string;
  lotteryId: string;
  name: string;
  logo: string | null;
  wrapRepository: string;
  resultLength: number;
  options: JsonValue;
  resultTime: string;
  createdAt: Date;
  deletedAt: Date | null;
}

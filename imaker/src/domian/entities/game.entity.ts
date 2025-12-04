export interface Game {
  id: string;
  lotteryId: string;
  name: string;
  slug: string;
  logo: string | null;
  resultTime: string;
  resultRenderComponent: string;
  createdAt: Date;
  deletedAt: Date | null;
}

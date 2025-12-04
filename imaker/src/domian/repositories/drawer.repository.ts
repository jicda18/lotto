export type Size = [number, number];
export type BallColorGeneratorData = {
  ball: string;
  index: number;
  length: number;
};
export type BallColorGenerator = (data: BallColorGeneratorData) => {
  from: string;
  via: string;
  to: string;
  font: string;
};

export interface DrawerRepository {
  draw(
    gameName: string,
    lotteryLogoUrl: string | null,
    dt: string,
    balls: string[],
    ballsPerLine: number[],
    ballsColorGenerator: BallColorGenerator,
    sizes: Size[]
  ): Promise<NodeJS.ArrayBufferView[]>;
}

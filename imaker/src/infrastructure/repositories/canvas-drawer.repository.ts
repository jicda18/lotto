import fs from "node:fs";
import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas,
  Image,
  loadImage,
  registerFont,
} from "canvas";
import { BallColorGenerator, DrawerRepository, Size } from "../../domian";
import { chunk, CreateLogger, Logger } from "../../config";
import { DOMParser } from "@xmldom/xmldom";
import { Canvg, RenderingContext2D } from "canvg";

export class CanvasDrawerRepository implements DrawerRepository {
  private logger: Logger;

  constructor(createLogger: CreateLogger) {
    this.logger = createLogger("canvas-drawer.repository.ts");
  }

  private async drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  private async drawConfetti(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    const confettiImage = await loadImage("./assets/images/confetti.png");

    const imgWidth = confettiImage.width;
    const imgHeight = confettiImage.height;

    const x = (width - imgWidth) / 2;
    const y = (height - imgHeight) / 2;

    ctx.drawImage(confettiImage, x, y, imgWidth, imgHeight);
  }

  private async makeBanner(width: number, height: number, text: string) {
    const svgString = fs.readFileSync("./assets/images/banner.svg", "utf8");

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const svg = Canvg.fromString(
      ctx as unknown as RenderingContext2D,
      svgString,
      {
        DOMParser: DOMParser,
        ignoreMouse: true,
        ignoreAnimation: true,
      }
    );
    await svg.render();

    let fontSize = width;
    do {
      ctx.font = `${fontSize--}px`;
    } while (ctx.measureText(text).width > width * 0.5);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2 - fontSize / 2);

    return canvas;
  }

  private async drawBanner(
    ctx: CanvasRenderingContext2D,
    banner: Canvas,
    width: number,
    height: number
  ) {
    const dx = (width - banner.width) / 2;
    const dy = height * 0.025;

    ctx.drawImage(banner, dx, dy, banner.width, banner.height);

    return dy;
  }

  private async drawLogo(
    ctx: CanvasRenderingContext2D,
    logoHeight: number,
    height: number
  ) {
    const image = await loadImage("./assets/images/logo.png");

    const logoWidth = image.width * (logoHeight / image.height);

    const canvas = createCanvas(logoWidth, logoHeight);
    const ctxLogo = canvas.getContext("2d");

    ctxLogo.fillStyle = "#fff";
    ctxLogo.fillRect(0, 0, logoWidth, logoHeight);
    ctxLogo.drawImage(image, 0, 0, logoWidth, logoHeight);

    const dx = logoWidth * 0.025;
    const dy = height * 0.975 - canvas.height;
    ctx.drawImage(canvas, dx, dy, canvas.width, canvas.height);

    ctx.font = "16px";
    ctx.fillStyle = "#093455";
    ctx.textAlign = "center";
    ctx.fillText("© Lotto.local", dx + canvas.width / 2, dy + canvas.height);

    return dy;
  }

  private async drawLogoLottery(
    ctx: CanvasRenderingContext2D,
    image: Image,
    logoHeight: number,
    width: number,
    height: number
  ) {
    const logoWidth = image.width * (logoHeight / image.height);

    const canvas = createCanvas(logoWidth, logoHeight);
    const ctxLogo = canvas.getContext("2d");

    ctxLogo.fillStyle = "#fff";
    ctxLogo.fillRect(0, 0, logoWidth, logoHeight);
    ctxLogo.drawImage(image, 0, 0, logoWidth, logoHeight);

    const dx = width * 0.975 - canvas.width;
    const dy = height * 0.975 - canvas.height;
    ctx.drawImage(canvas, dx, dy, canvas.width, canvas.height);

    return dy;
  }

  private async drawDate(
    ctx: CanvasRenderingContext2D,
    dt: string,
    dx: number,
    dy: number
  ) {
    ctx.font = "40px";
    ctx.fillStyle = "#093455";
    ctx.textAlign = "center";
    ctx.fillText(dt, dx, dy);
  }

  private async makeBall(
    size: number,
    value: string,
    from: string,
    via: string,
    to: string,
    fontColor: string
  ) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    const margin = size * 0.05;
    const center = size / 2;
    const radius = center - margin;

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, from);
    gradient.addColorStop(0.5, via);
    gradient.addColorStop(1, to);

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Calculate max font size
    let fontSize = radius;
    do {
      ctx.font = `${fontSize--}px`;
    } while (ctx.measureText(value).width > radius);

    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, center, center);

    return canvas;
  }

  private async drawBalls(
    ctx: CanvasRenderingContext2D,
    width: number,
    balls: string[],
    start: number,
    end: number,
    perLine: number,
    ballsColorGenerator: BallColorGenerator
  ) {
    const ballArea = Math.abs(end - start);
    const linesCount = Math.ceil(balls.length / perLine);

    const ballSize = Math.min(
      200,
      Math.floor((width - 100) / perLine),
      Math.floor(ballArea / linesCount) * 1.5
    );

    let dy = start + (ballArea - linesCount * ballSize) / 2;
    if (dy <= start) {
      dy = start + 8;
    }

    const ballsCanvas = await Promise.all(
      balls.map((value, i) => {
        const { from, via, to, font } = ballsColorGenerator({
          ball: value,
          index: i,
          length: balls.length,
        });

        return this.makeBall(ballSize, value, from, via, to, font);
      })
    );

    // Draw ball in the canvas
    const lines = chunk(ballsCanvas, perLine);
    for (const line of lines) {
      let dx = (width - line.length * ballSize) / 2;

      for (const ball of line) {
        ctx.drawImage(ball, dx, dy);

        dx += ballSize;
      }

      dy += ballSize;
    }
  }

  async draw(
    gameName: string,
    lotteryLogoUrl: string | null,
    dt: string,
    balls: string[],
    ballsPerLine: number[],
    ballsColorGenerator: BallColorGenerator,

    sizes: Size[]
  ): Promise<NodeJS.ArrayBufferView[]> {
    this.logger.info("Drawing images", {
      context: { gameName, dt, balls, sizes },
    });

    registerFont("./assets/fonts/GoogleSansCode-Medium.ttf", {
      family: "sans-code",
    });

    const lotteryLogoImage = lotteryLogoUrl
      ? await loadImage(lotteryLogoUrl)
      : null;
    if (lotteryLogoUrl)
      this.logger.info("Lottery logo loaded", { context: { lotteryLogoUrl } });

    return await Promise.all(
      sizes.map(async (size, index) => {
        const [width, height] = size;
        this.logger.info(`Drawing image for size: ${width}x${height}`, {
          context: { width, height },
        });

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        this.logger.info("Canvas and context created", {
          context: { width, height },
        });

        await this.drawBackground(ctx, width, height, "#ffffff");
        await this.drawConfetti(ctx, width, height);
        this.logger.info("Background and confetti drawn", {
          context: { width, height },
        });

        const bannerWidth = width * 1;
        const bannerHeight = bannerWidth * 0.15;
        const banner = await this.makeBanner(
          bannerWidth,
          bannerHeight,
          gameName
        );
        this.logger.info("Banner created", {
          context: { bannerWidth, bannerHeight },
        });

        const bannerStartY = await this.drawBanner(ctx, banner, width, height);
        const bannerEndY = bannerStartY + bannerHeight;

        const logoStartY = await this.drawLogo(ctx, bannerHeight, height);
        const logoEndY = logoStartY + bannerHeight;

        if (lotteryLogoImage) {
          await this.drawLogoLottery(
            ctx,
            lotteryLogoImage,
            bannerHeight,
            width,
            height
          );
          this.logger.info("Lottery logo drawn", {
            context: { lotteryLogoUrl },
          });
        }

        await this.drawDate(ctx, dt, width / 2, logoEndY - 8);
        this.logger.info("Date drawn", { context: { dt } });

        const perLine = ballsPerLine.at(index) ?? 4;

        await this.drawBalls(
          ctx,
          width,
          balls,
          bannerEndY,
          logoStartY,
          perLine,
          ballsColorGenerator
        );
        this.logger.info("Balls drawn", { context: { balls } });

        return canvas.toBuffer("image/png");
      })
    );
  }
}

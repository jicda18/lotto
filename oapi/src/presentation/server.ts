import express, { Router } from "express";
import cors from "cors";
import { Limiter } from "../config";

interface Options {
  port: number;
  routes: Router;
  origin: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly origin: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, origin } = options;
    this.port = port;
    this.routes = routes;
    this.origin = origin;
  }

  async start() {
    // Deshabilitar el header
    this.app.disable("x-powered-by");

    const corsOptions = {
      origin: [`${this.origin}`],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    };

    this.app.set("trust proxy", 1);

    //* Middlewares
    this.app.use(cors(corsOptions));
    this.app.use(Limiter);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //* Routes
    this.app.use(this.routes);

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}

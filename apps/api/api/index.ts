import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import helmet from "helmet";
import express, { Express, Request, Response } from "express";
import { AppModule } from "../src/app.module";

let cachedServer: Express | null = null;

async function createServer(): Promise<Express> {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use((_request: unknown, response: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.init();
  cachedServer = expressApp;
  return cachedServer;
}

export default async function handler(req: Request, res: Response) {
  const server = await createServer();
  server(req, res);
}

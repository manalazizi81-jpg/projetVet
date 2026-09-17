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
  try {
    const origin = req.headers.origin as string | undefined;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    const server = await createServer();
    server(req, res);
  } catch (error: unknown) {
    console.error("Vercel Serverless Function Error:", error);
    const err = error as { message?: string; stack?: string };
    res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: err?.message || String(error),
      detail: "Vérifiez que la variable DATABASE_URL est bien configurée dans les variables d'environnement Vercel de l'API."
    });
  }
}

import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use((_request: unknown, response: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    response.setHeader("Cache-Control", "no-store");
    next();
  });
  if (!process.env.VERCEL) {
    app.enableCors({
      origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
      credentials: true
    });
  }
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();

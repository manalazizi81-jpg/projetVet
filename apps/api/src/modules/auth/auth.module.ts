import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
const jwtSecret = process.env.JWT_SECRET;
if ((process.env.NODE_ENV === "production" || process.env.VERCEL) && (!jwtSecret || jwtSecret.length < 32 || jwtSecret === "replace-with-a-long-random-secret")) {
  throw new Error("JWT_SECRET doit contenir au moins 32 caractères aléatoires en production.");
}

@Module({imports:[JwtModule.register({global:true,secret:jwtSecret ?? "development-only-change-me",signOptions:{expiresIn:"8h"}})],controllers:[AuthController],providers:[AuthService,JwtAuthGuard],exports:[JwtAuthGuard]})
export class AuthModule {}

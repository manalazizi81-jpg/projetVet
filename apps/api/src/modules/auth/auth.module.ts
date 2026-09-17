import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
const defaultSecret = "atlas-jwt-secret-key-minimum-32-characters-default-2026";
const jwtSecret = process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32 ? process.env.JWT_SECRET : defaultSecret;

@Module({imports:[JwtModule.register({global:true,secret:jwtSecret ?? "development-only-change-me",signOptions:{expiresIn:"8h"}})],controllers:[AuthController],providers:[AuthService,JwtAuthGuard],exports:[JwtAuthGuard]})
export class AuthModule {}

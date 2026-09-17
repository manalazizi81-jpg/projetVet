import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
@Injectable()
export class AuthService {
  private static readonly dummyPasswordHash = "$2b$12$VFnmo2s/2Ne78fTobHCa7.G97wgp70mGPq5XqeGHyGxmXHAoT7gpi";
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({ where: { email: dto.email.trim().toLowerCase() } });
    const passwordMatches = await compare(dto.password, admin?.passwordHash ?? AuthService.dummyPasswordHash);
    if (!admin || !admin.isActive || !passwordMatches) {
      throw new UnauthorizedException("Identifiants incorrects");
    }
    await this.prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    return { accessToken: await this.jwt.signAsync({ sub: admin.id, version: admin.tokenVersion }), admin: { id: admin.id, email: admin.email, fullName: admin.fullName } };
  }

  profile(id: string) {
    return this.prisma.admin.findUniqueOrThrow({
      where: { id },
      select: { id: true, email: true, fullName: true, isActive: true, createdAt: true, lastLoginAt: true },
    });
  }

  updateProfile(id: string, fullName: unknown) {
    if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 120) {
      throw new BadRequestException("Le nom doit contenir entre 2 et 120 caractères.");
    }
    return this.prisma.admin.update({
      where: { id },
      data: { fullName: fullName.trim() },
      select: { id: true, email: true, fullName: true, isActive: true, createdAt: true, lastLoginAt: true },
    });
  }
}

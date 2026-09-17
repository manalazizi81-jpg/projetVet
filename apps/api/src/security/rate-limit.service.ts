import { createHash } from "node:crypto";
import { Global, HttpException, HttpStatus, Injectable, Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type ClientRequest = { ip?: string; headers: Record<string, string | string[] | undefined> };

@Injectable()
export class RateLimitService {
  constructor(private readonly prisma: PrismaService) {}

  private clientIp(request: ClientRequest): string {
    // Vercel remplace ce header avant l'appel de la fonction, pour éviter l'usurpation d'IP.
    const forwarded = process.env.VERCEL ? request.headers["x-vercel-forwarded-for"] : undefined;
    const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return value?.split(",")[0]?.trim() || request.ip || "unknown";
  }

  async check(request: ClientRequest, scope: string, limit: number, windowSeconds: number, subject?: string) {
    const identifier = subject ? subject.trim().toLowerCase() : this.clientIp(request);
    const key = createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
    const result = await this.prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "RequestRateLimit" ("key", "windowStart", "count")
      VALUES (${key}, now(), 1)
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RequestRateLimit"."windowStart" < now() - make_interval(secs => ${windowSeconds}::integer)
          THEN 1 ELSE "RequestRateLimit"."count" + 1 END,
        "windowStart" = CASE WHEN "RequestRateLimit"."windowStart" < now() - make_interval(secs => ${windowSeconds}::integer)
          THEN now() ELSE "RequestRateLimit"."windowStart" END
      RETURNING "count"
    `;
    if (result[0]?.count > limit) {
      const minutes = Math.ceil(windowSeconds / 60);
      throw new HttpException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: "Too Many Requests",
        message: `Trop de demandes. Réessayez dans ${minutes} minutes.`,
        retryAfter: windowSeconds,
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}

@Global()
@Module({ providers: [RateLimitService], exports: [RateLimitService] })
export class RateLimitModule {}

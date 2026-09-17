import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GalleryService } from "./gallery.service";

@Controller("gallery")
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Get()
  list() { return this.service.list(); }

  @Get("admin")
  @UseGuards(JwtAuthGuard)
  listAdmin() { return this.service.list(false); }

  @Get(":id/file")
  async image(@Param("id") id: string, @Res() response: Response) {
    const photo = await this.service.image(id);
    response.setHeader("Content-Type", photo.mimeType);
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    response.end(Buffer.from(photo.data));
  }

  @Get("admin/:id/file")
  @UseGuards(JwtAuthGuard)
  async adminImage(@Param("id") id: string, @Res() response: Response) {
    const photo = await this.service.image(id, false);
    response.setHeader("Content-Type", photo.mimeType);
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    response.end(Buffer.from(photo.data));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } }))
  upload(@UploadedFile() file: { buffer: Buffer; mimetype: string; size: number } | undefined, @Body("alt") alt: string) {
    return this.service.create(file, alt);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() body: { alt?: string; isPublished?: boolean; sortOrder?: number }) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) { return this.service.remove(id); }
}

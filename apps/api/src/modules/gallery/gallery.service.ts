import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

type Upload = { buffer: Buffer; mimetype: string; size: number };

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  list(publishedOnly = true) {
    return this.prisma.galleryPhoto.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      select: { id: true, alt: true, mimeType: true, isPublished: true, sortOrder: true, createdAt: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  async image(id: string, publishedOnly = true) {
    const photo = await this.prisma.galleryPhoto.findFirst({
      where: publishedOnly ? { id, isPublished: true } : { id },
      select: { data: true, mimeType: true },
    });
    if (!photo) throw new NotFoundException("Photo introuvable");
    return photo;
  }

  async create(file: Upload | undefined, alt: string) {
    if (!file?.buffer || !file.size || file.size > 5 * 1024 * 1024) {
      throw new BadRequestException("Choisissez une image de 5 Mo maximum.");
    }
    const bytes = file.buffer;
    const validJpeg = file.mimetype === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const validPng = file.mimetype === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const validWebp = file.mimetype === "image/webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!validJpeg && !validPng && !validWebp) throw new BadRequestException("Format accepté : JPG, PNG ou WebP.");
    const description = typeof alt === "string" ? alt.trim() : "";
    if (!description || description.length > 250) throw new BadRequestException("Ajoutez une description de 250 caractères maximum.");
    const last = await this.prisma.galleryPhoto.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
    const photo = await this.prisma.galleryPhoto.create({
      data: { alt: description, mimeType: file.mimetype, data: bytes, sortOrder: (last?.sortOrder ?? -1) + 1 },
      select: { id: true, alt: true, isPublished: true, sortOrder: true, createdAt: true },
    });
    return photo;
  }

  async update(id: string, body: { alt?: string; isPublished?: boolean; sortOrder?: number }) {
    if (body.alt !== undefined && (typeof body.alt !== "string" || !body.alt.trim() || body.alt.length > 250)) throw new BadRequestException("Description invalide.");
    if (body.isPublished !== undefined && typeof body.isPublished !== "boolean") throw new BadRequestException("Publication invalide.");
    if (body.sortOrder !== undefined && (!Number.isInteger(body.sortOrder) || body.sortOrder < 0 || body.sortOrder > 10000)) throw new BadRequestException("Ordre invalide.");
    const exists = await this.prisma.galleryPhoto.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException("Photo introuvable");
    return this.prisma.galleryPhoto.update({
      where: { id },
      data: { alt: body.alt?.trim(), isPublished: body.isPublished, sortOrder: body.sortOrder },
      select: { id: true, alt: true, isPublished: true, sortOrder: true, createdAt: true },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.galleryPhoto.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException("Photo introuvable");
    await this.prisma.galleryPhoto.delete({ where: { id } });
    return { deleted: true };
  }
}

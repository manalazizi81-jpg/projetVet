import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateContactDto } from "./dto/create-contact.dto";
@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateContactDto) {
    const { fullName, email, phone, subject, message } = dto;
    return this.prisma.contactMessage.create({ data: { fullName, email, phone, subject, message }, select: { id: true, createdAt: true } });
  }
  findAll() { return this.prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }); }
  async update(id: string, status: string) {
    if (!["NEW", "READ", "ARCHIVED"].includes(status)) throw new BadRequestException("Statut invalide");
    const exists = await this.prisma.contactMessage.findUnique({ where: { id }, select: { id: true, readAt: true } });
    if (!exists) throw new NotFoundException("Message introuvable");
    return this.prisma.contactMessage.update({ where: { id }, data: { status: status as "NEW" | "READ" | "ARCHIVED", readAt: status === "NEW" ? null : exists.readAt ?? new Date() } });
  }
}

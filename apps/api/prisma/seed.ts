import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const services = [
  ["consultation", "Consultation", "Un examen attentif et des conseils adaptés.", "stethoscope"],
  ["hospitalisation", "Hospitalisation", "Une surveillance régulière et des soins adaptés.", "bed"],
  ["urgences", "Urgences", "Une prise en charge rapide quand chaque minute compte.", "ambulance"],
  ["radiologie", "Radiologie", "Une imagerie précise pour établir le diagnostic.", "scan-line"],
  ["analyses-biologiques", "Analyses biologiques", "Des examens biologiques pour orienter les soins.", "flask-conical"],
  ["chirurgie", "Chirurgie", "Un bloc moderne et une surveillance rigoureuse.", "heart-pulse"],
  ["toilettage", "Toilettage", "Des soins d'hygiène réalisés avec douceur.", "scissors"],
  ["garde", "Garde", "Un accueil attentif pendant votre absence.", "moon-star"],
  ["dentisterie", "Dentisterie", "Des soins pour préserver sa santé bucco-dentaire.", "bone"]
] as const;

async function main() {
  for (const [slug, title, shortDescription, icon] of services) {
    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: { slug, title, shortDescription, description: shortDescription, icon, isPublished: true }
    });
  }
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await prisma.admin.upsert({
      where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
      update: {},
      create: { email: process.env.ADMIN_EMAIL.toLowerCase(), fullName: "Administration Atlas", passwordHash: await hash(process.env.ADMIN_PASSWORD, 12) }
    });
  }
  const now = new Date();
  for (let offset = 1; offset <= 30; offset++) {
    const day = new Date(now);
    day.setDate(day.getDate() + offset);
    if (day.getDay() === 0) continue;
    for (const hour of [9, 10, 11, 14, 15, 16, 17]) {
      const startsAt = new Date(day);
      startsAt.setHours(hour, 0, 0, 0);
      const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
      await prisma.availabilitySlot.upsert({ where: { startsAt }, update: {}, create: { startsAt, endsAt } });
    }
  }
}

main()
  .finally(async () => prisma.$disconnect());

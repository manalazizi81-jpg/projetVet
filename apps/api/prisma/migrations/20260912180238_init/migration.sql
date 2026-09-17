-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AnimalSpecies" AS ENUM ('DOG', 'CAT', 'BIRD', 'RABBIT', 'RODENT', 'REPTILE', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "species" "AnimalSpecies" NOT NULL,
    "breed" VARCHAR(100),
    "birthDate" DATE,
    "birthDateIsEstimated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "animalId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "slotId" UUID NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "ownerName" VARCHAR(120) NOT NULL,
    "ownerPhone" VARCHAR(30) NOT NULL,
    "ownerEmail" VARCHAR(254) NOT NULL,
    "serviceLabel" VARCHAR(120) NOT NULL,
    "message" TEXT,
    "adminNotes" TEXT,
    "cancellationReason" VARCHAR(500),
    "requestKey" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilitySlot" (
    "id" UUID NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockNote" VARCHAR(250),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "shortDescription" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(60) NOT NULL,
    "imageUrl" VARCHAR(2048),
    "imageAlt" VARCHAR(250),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isBookable" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "role" VARCHAR(120) NOT NULL,
    "specialties" TEXT[],
    "biography" TEXT,
    "photoUrl" VARCHAR(2048),
    "photoAlt" VARCHAR(250),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" UUID NOT NULL,
    "authorName" VARCHAR(120) NOT NULL,
    "animalName" VARCHAR(100),
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "photoUrl" VARCHAR(2048),
    "photoAlt" VARCHAR(250),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(30),
    "subject" VARCHAR(180) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "readAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_phone_idx" ON "Client"("phone");

-- CreateIndex
CREATE INDEX "Animal_clientId_idx" ON "Animal"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_requestKey_key" ON "Appointment"("requestKey");

-- CreateIndex
CREATE INDEX "Appointment_slotId_idx" ON "Appointment"("slotId");

-- CreateIndex
CREATE INDEX "Appointment_status_createdAt_idx" ON "Appointment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Appointment_clientId_idx" ON "Appointment"("clientId");

-- CreateIndex
CREATE INDEX "Appointment_animalId_idx" ON "Appointment"("animalId");

-- CreateIndex
CREATE INDEX "Appointment_serviceId_idx" ON "Appointment"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilitySlot_startsAt_key" ON "AvailabilitySlot"("startsAt");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_isBlocked_startsAt_idx" ON "AvailabilitySlot"("isBlocked", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AvailabilitySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

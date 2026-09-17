CREATE TABLE "GalleryPhoto" (
    "id" UUID NOT NULL,
    "alt" VARCHAR(250) NOT NULL,
    "mimeType" VARCHAR(50) NOT NULL,
    "data" BYTEA NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GalleryPhoto_isPublished_sortOrder_createdAt_idx" ON "GalleryPhoto"("isPublished", "sortOrder", "createdAt");

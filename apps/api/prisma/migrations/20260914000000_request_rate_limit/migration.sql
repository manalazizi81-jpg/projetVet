CREATE TABLE "RequestRateLimit" (
    "key" VARCHAR(64) NOT NULL,
    "windowStart" TIMESTAMPTZ(3) NOT NULL,
    "count" INTEGER NOT NULL,
    CONSTRAINT "RequestRateLimit_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "RequestRateLimit_windowStart_idx" ON "RequestRateLimit"("windowStart");

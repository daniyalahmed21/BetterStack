-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('Open', 'Closed');

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "status" "IncidentStatus" NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Incident_websiteId_status_idx" ON "Incident"("websiteId", "status");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('IncidentStarted', 'IncidentResolved');

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alert_incidentId_type_key" ON "Alert"("incidentId", "type");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

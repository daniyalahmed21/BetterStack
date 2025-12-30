-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "lastCheckedAt" TIMESTAMP(3),
ADD COLUMN     "status" "WebsiteStatus" NOT NULL DEFAULT 'Unknown';

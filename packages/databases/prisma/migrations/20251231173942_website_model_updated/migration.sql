-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "frequency" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "timeout" INTEGER NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE "_WebsiteToRegion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WebsiteToRegion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_WebsiteToRegion_B_index" ON "_WebsiteToRegion"("B");

-- AddForeignKey
ALTER TABLE "_WebsiteToRegion" ADD CONSTRAINT "_WebsiteToRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WebsiteToRegion" ADD CONSTRAINT "_WebsiteToRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

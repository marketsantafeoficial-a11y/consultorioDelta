-- AlterTable
ALTER TABLE "Professional" ADD COLUMN "photoUrl" TEXT;
ALTER TABLE "Professional" ADD COLUMN "serves" TEXT;

-- CreateTable
CREATE TABLE "AuthUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "professionalId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuthUser_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_professionalId_key" ON "AuthUser"("professionalId");

-- CreateIndex
CREATE INDEX "AuthUser_role_idx" ON "AuthUser"("role");

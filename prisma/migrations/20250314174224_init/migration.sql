-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('HEAD_NURSE', 'NURSE', 'DOCTOR', 'OFFICE_STAFF', 'ROOM_ATTENDANT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "maxOccupants" INTEGER NOT NULL,
    "wardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "staffNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "niNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "wardId" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "patientNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "illness" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL,
    "leavingDate" TIMESTAMP(3),
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "next_of_kin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "next_of_kin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examinations" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "pulse" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "prescriptionDate" TIMESTAMP(3) NOT NULL,
    "treatmentLength" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wards_name_key" ON "wards"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomNumber_key" ON "rooms"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "staff_userId_key" ON "staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_staffNumber_key" ON "staff"("staffNumber");

-- CreateIndex
CREATE UNIQUE INDEX "staff_niNumber_key" ON "staff"("niNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_patientNumber_key" ON "patients"("patientNumber");

-- CreateIndex
CREATE UNIQUE INDEX "drugs_code_key" ON "drugs"("code");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "wards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "wards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "next_of_kin" ADD CONSTRAINT "next_of_kin_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drugs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

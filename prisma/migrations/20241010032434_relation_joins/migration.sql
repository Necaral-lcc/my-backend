-- AlterTable
ALTER TABLE `User` ADD COLUMN `sex` ENUM('Unknown', 'MALE', 'FEMALE') NOT NULL DEFAULT 'Unknown';

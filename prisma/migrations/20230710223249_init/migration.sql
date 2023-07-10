/*
  Warnings:

  - A unique constraint covering the columns `[email,role]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,childId,visitTime]` on the table `CourseChildRelation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Account_email_key` ON `Account`;

-- CreateIndex
CREATE UNIQUE INDEX `Account_email_role_key` ON `Account`(`email`, `role`);

-- CreateIndex
CREATE UNIQUE INDEX `CourseChildRelation_courseId_childId_visitTime_key` ON `CourseChildRelation`(`courseId`, `childId`, `visitTime`);

-- CreateIndex
CREATE UNIQUE INDEX `Manager_phone_key` ON `Manager`(`phone`);

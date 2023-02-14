/*
  Warnings:

  - You are about to drop the `_ProjectToTodo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToTodo" DROP CONSTRAINT "_ProjectToTodo_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTodo" DROP CONSTRAINT "_ProjectToTodo_B_fkey";

-- AlterTable
ALTER TABLE "todo" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ProjectToTodo";

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

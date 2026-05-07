-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "lastStatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "method" "HttpMethod" NOT NULL DEFAULT 'GET',
ADD COLUMN     "tags" TEXT[];

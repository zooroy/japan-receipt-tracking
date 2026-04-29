-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('reduced_8', 'standard_10', 'tax_free', 'unknown');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('food', 'shopping', 'transport', 'accommodation', 'sightseeing', 'other');

-- CreateTable
CREATE TABLE "travels" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" UUID NOT NULL,
    "travel_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "store_name" TEXT NOT NULL,
    "store_name_zh" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "total_amount_twd" INTEGER NOT NULL,
    "exchange_rate" DECIMAL(10,4) NOT NULL,
    "tax_type" "TaxType" NOT NULL,
    "category" "Category" NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rate_cache" (
    "date" DATE NOT NULL,
    "rate" DECIMAL(10,4) NOT NULL,
    "fetched_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "exchange_rate_cache_pkey" PRIMARY KEY ("date")
);

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_travel_id_fkey" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

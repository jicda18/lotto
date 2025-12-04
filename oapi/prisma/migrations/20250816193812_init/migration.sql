-- CreateTable
CREATE TABLE "public"."lotteries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "lotteries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."games" (
    "id" UUID NOT NULL,
    "lotteryId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "wrapRepository" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "resultTime" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."results" (
    "gameId" UUID NOT NULL,
    "eventTime" TIMESTAMPTZ(3) NOT NULL,
    "position" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "results_pkey" PRIMARY KEY ("gameId","eventTime","position")
);

-- CreateTable
CREATE TABLE "public"."logs" (
    "id" UUID NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lotteries_slug_key" ON "public"."lotteries"("slug");

-- CreateIndex
CREATE INDEX "lotteries_deletedAt_idx" ON "public"."lotteries"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "public"."games"("slug");

-- CreateIndex
CREATE INDEX "games_deletedAt_idx" ON "public"."games"("deletedAt");

-- CreateIndex
CREATE INDEX "results_gameId_idx" ON "public"."results"("gameId");

-- CreateIndex
CREATE INDEX "results_eventTime_idx" ON "public"."results"("eventTime");

-- CreateIndex
CREATE INDEX "results_deletedAt_idx" ON "public"."results"("deletedAt");

-- CreateIndex
CREATE INDEX "logs_level_idx" ON "public"."logs"("level");

-- CreateIndex
CREATE INDEX "logs_service_idx" ON "public"."logs"("service");

-- CreateIndex
CREATE INDEX "logs_module_idx" ON "public"."logs"("module");

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_lotteryId_fkey" FOREIGN KEY ("lotteryId") REFERENCES "public"."lotteries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."results" ADD CONSTRAINT "results_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

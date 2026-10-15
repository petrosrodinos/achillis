-- CreateEnum
CREATE TYPE "AuthRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('locked', 'unlocked', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('squire', 'knight', 'champion');

-- CreateEnum
CREATE TYPE "MissionRank" AS ENUM ('S', 'A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "GameRunStatus" AS ENUM ('started', 'completed', 'defeated', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "username_normalized" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AuthRole" NOT NULL DEFAULT 'USER',
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL DEFAULT 'Squire',
    "current_mission_id" TEXT NOT NULL DEFAULT 'm01',
    "highest_unlocked_mission_id" TEXT NOT NULL DEFAULT 'm01',
    "save_version" INTEGER NOT NULL DEFAULT 1,
    "emperor_knight_unlocked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "settings" (
    "user_id" TEXT NOT NULL,
    "master_volume" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "music_volume" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "sfx_volume" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "reduced_motion" BOOLEAN NOT NULL DEFAULT false,
    "screen_shake" BOOLEAN NOT NULL DEFAULT true,
    "show_fps" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'knight',
    "key_bindings" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "mission_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'unlocked',
    "best_score" INTEGER NOT NULL DEFAULT 0,
    "best_time_ms" INTEGER,
    "best_rank" "MissionRank",
    "completions" INTEGER NOT NULL DEFAULT 0,
    "first_completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "rank" "MissionRank" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unlocked_characters" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unlocked_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_runs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "status" "GameRunStatus" NOT NULL DEFAULT 'started',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "game_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "replaced_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_normalized_key" ON "users"("username_normalized");

-- CreateIndex
CREATE INDEX "profiles_total_points_idx" ON "profiles"("total_points");

-- CreateIndex
CREATE INDEX "mission_progress_mission_id_best_score_idx" ON "mission_progress"("mission_id", "best_score");

-- CreateIndex
CREATE INDEX "mission_progress_mission_id_best_time_ms_idx" ON "mission_progress"("mission_id", "best_time_ms");

-- CreateIndex
CREATE UNIQUE INDEX "mission_progress_user_id_mission_id_key" ON "mission_progress"("user_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "score_entries_run_id_key" ON "score_entries"("run_id");

-- CreateIndex
CREATE INDEX "score_entries_created_at_idx" ON "score_entries"("created_at");

-- CreateIndex
CREATE INDEX "score_entries_mission_id_created_at_idx" ON "score_entries"("mission_id", "created_at");

-- CreateIndex
CREATE INDEX "score_entries_user_id_mission_id_idx" ON "score_entries"("user_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "unlocked_characters_user_id_character_id_key" ON "unlocked_characters"("user_id", "character_id");

-- CreateIndex
CREATE INDEX "game_runs_user_id_status_idx" ON "game_runs"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_progress" ADD CONSTRAINT "mission_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_entries" ADD CONSTRAINT "score_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unlocked_characters" ADD CONSTRAINT "unlocked_characters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_runs" ADD CONSTRAINT "game_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

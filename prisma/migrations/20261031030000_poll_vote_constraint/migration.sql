ALTER TABLE "PollVote" ADD COLUMN "pollId" TEXT;
UPDATE "PollVote" AS v SET "pollId" = o."pollId" FROM "PollOption" AS o WHERE v."optionId" = o."id";
ALTER TABLE "PollVote" ALTER COLUMN "pollId" SET NOT NULL;
DROP INDEX IF EXISTS "PollVote_optionId_userId_key";
CREATE UNIQUE INDEX "PollVote_pollId_userId_key" ON "PollVote"("pollId","userId");
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

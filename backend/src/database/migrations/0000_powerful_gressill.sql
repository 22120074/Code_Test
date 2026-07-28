CREATE TABLE "exam_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"registration_number" varchar(8) NOT NULL,
	"math" numeric(4, 2),
	"literature" numeric(4, 2),
	"foreign_language" numeric(4, 2),
	"physics" numeric(4, 2),
	"chemistry" numeric(4, 2),
	"biology" numeric(4, 2),
	"history" numeric(4, 2),
	"geography" numeric(4, 2),
	"civic_education" numeric(4, 2),
	"foreign_language_code" varchar(4),
	CONSTRAINT "exam_scores_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE INDEX "idx_registration_number" ON "exam_scores" USING btree ("registration_number");
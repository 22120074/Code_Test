CREATE TABLE "diem_thi" (
	"id" serial PRIMARY KEY NOT NULL,
	"sbd" varchar(8) NOT NULL,
	"toan" numeric(4, 2),
	"ngu_van" numeric(4, 2),
	"ngoai_ngu" numeric(4, 2),
	"vat_li" numeric(4, 2),
	"hoa_hoc" numeric(4, 2),
	"sinh_hoc" numeric(4, 2),
	"lich_su" numeric(4, 2),
	"dia_li" numeric(4, 2),
	"gdcd" numeric(4, 2),
	"ma_ngoai_ngu" varchar(4),
	CONSTRAINT "diem_thi_sbd_unique" UNIQUE("sbd")
);
--> statement-breakpoint
CREATE INDEX "idx_sbd" ON "diem_thi" USING btree ("sbd");
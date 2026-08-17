CREATE TABLE "clicks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"url_id" bigint,
	"clicked_at" timestamp with time zone DEFAULT now(),
	"referrer" text,
	"user_agent" text,
	"country" char(2)
);
--> statement-breakpoint
CREATE TABLE "urls" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"short_code" varchar(10) NOT NULL,
	"long_url" text NOT NULL,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone,
	"click_count" bigint DEFAULT 0,
	CONSTRAINT "urls_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "short_code_idx" ON "urls" USING btree ("short_code");
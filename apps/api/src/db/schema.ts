import {
  pgTable,
  bigserial,
  varchar,
  text,
  uuid,
  timestamp,
  bigint,
  index,
  char,
} from "drizzle-orm/pg-core";

export const urls = pgTable(
  "urls",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    shortCode: varchar("short_code", { length: 10 }).notNull().unique(),
    longUrl: text("long_url").notNull(),
    userId: uuid("user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    clickCount: bigint("click_count", { mode: "number" }).default(0),
  },
  (table) => [index("short_code_idx").on(table.shortCode)]
);

export const clicks = pgTable("clicks", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  urlId: bigint("url_id", { mode: "number" }).references(() => urls.id),
  clickedAt: timestamp("clicked_at", { withTimezone: true }).defaultNow(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: char("country", { length: 2 }),
});

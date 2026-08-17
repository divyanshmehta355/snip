import {
  pgTable,
  bigserial,
  varchar,
  text,
  timestamp,
  bigint,
  index,
  char,
  integer,
  primaryKey
} from "drizzle-orm/pg-core";

// --- NextAuth Tables ---
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

// --- App Tables ---
export const urls = pgTable(
  "urls",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    shortCode: varchar("short_code", { length: 10 }).notNull().unique(),
    longUrl: text("long_url").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    clickCount: bigint("click_count", { mode: "number" }).default(0),
  },
  (table) => [index("short_code_idx").on(table.shortCode)]
);

export const clicks = pgTable("clicks", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  urlId: bigint("url_id", { mode: "number" }).references(() => urls.id, { onDelete: "cascade" }),
  clickedAt: timestamp("clicked_at", { withTimezone: true }).defaultNow(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: char("country", { length: 2 }),
});

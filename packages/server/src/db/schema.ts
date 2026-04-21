import { pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type z from "zod";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 60 }).notNull(),
});

export const User = createSelectSchema(users);
export type User = z.infer<typeof User>;

export const pastes = pgTable("pastes", {
    id: uuid("id").primaryKey().defaultRandom(),
    short_id: varchar().unique().notNull(),
    owner: uuid("owner")
        .references(() => users.id)
        .notNull(),
    language: varchar({ length: 50 }),
    text: text("text").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

export const Paste = createSelectSchema(pastes);
export type Paste = z.infer<typeof Paste>;

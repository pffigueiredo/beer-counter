import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const beersTable = pgTable('beers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type Beer = typeof beersTable.$inferSelect; // For SELECT operations
export type NewBeer = typeof beersTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { beers: beersTable };
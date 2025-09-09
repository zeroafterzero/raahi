import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const focusSessions = pgTable("focus_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionType: text("session_type").notNull(), // 'focus', 'short_break', 'long_break'
  durationRequested: integer("duration_requested").notNull(), // in seconds
  durationActual: integer("duration_actual"), // in seconds
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({
  id: true,
  createdAt: true,
}).extend({
  startedAt: z.coerce.date(),
});

export const updateFocusSessionSchema = createInsertSchema(focusSessions).partial().pick({
  durationActual: true,
  endedAt: true,
  completed: true,
}).extend({
  endedAt: z.coerce.date().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FocusSession = typeof focusSessions.$inferSelect;
export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type UpdateFocusSession = z.infer<typeof updateFocusSessionSchema>;

// Frontend types
export interface FocusStats {
  todayMinutes: number;
  completedCycles: number;
  currentStreak: number;
  avgSession: number;
  lastSessions: FocusSession[];
}

export interface WeeklyStats {
  days: { day: string; minutes: number }[];
  totalHours: number;
}

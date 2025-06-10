import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  paid_by: text("paid_by").notNull(),
  split_type: text("split_type").notNull().default("equal"),
  split_data: text("split_data"), // JSON string for custom splits
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const settlements = pgTable("settlements", {
  id: serial("id").primaryKey(),
  from_person: text("from_person").notNull(),
  to_person: text("to_person").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  is_settled: integer("is_settled").notNull().default(0), // 0 = false, 1 = true
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  created_at: true,
}).extend({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  paid_by: z.string().min(1, "Paid by is required").max(100),
  split_type: z.enum(["equal", "percentage", "exact"]).default("equal"),
  split_data: z.string().optional(),
});

export const insertPersonSchema = createInsertSchema(people).omit({
  id: true,
  created_at: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100),
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof people.$inferSelect;
export type Settlement = typeof settlements.$inferSelect;

// Additional types for calculations
export type PersonBalance = {
  name: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
  expenseCount: number;
};

export type SettlementSummary = {
  from: string;
  to: string;
  amount: number;
};

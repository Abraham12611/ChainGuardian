import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema kept from template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Chat messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'ai'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata"), // For structured AI response data
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  sender: true,
  metadata: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Single token data type
export interface TokenData {
  price: string;
  priceChange24h: string;
  marketCap: string;
  volume24h: string;
  liquidity: string;
}

// Token list item type
export interface TokenListItem {
  name: string;
  symbol: string;
  price: string;
  priceChange24h: string;
  liquidity: string;
  volume24h: string;
}

// AI Response types
export interface AIResponse {
  text: string;
  tokenData?: TokenData;
  tokenList?: TokenListItem[];
  riskLevel?: "low" | "medium" | "high";
  riskFactors?: string[];
}
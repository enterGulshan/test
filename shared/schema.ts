import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  rating: doublePrecision("rating").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  items: text("items").array().notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull(),
  paymentMethod: text("payment_method").notNull(),
  // Add address field since we'll need it for delivery
  address: text("address").notNull(),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true });

export type Restaurant = typeof restaurants.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const CATEGORIES = [
  "Fast Food",
  "Pizza",
  "Asian",
  "Italian",
  "Mexican",
  "Healthy"
] as const;

export const PAYMENT_METHODS = [
  "card",
  "upi",
  "cash"
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];
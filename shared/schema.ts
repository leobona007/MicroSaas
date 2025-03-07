<<<<<<< HEAD
import { pgTable, text, serial, integer, boolean, timestamp, date, time, real } from "drizzle-orm/pg-core";
=======
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
>>>>>>> 857c171 (first commit)
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
<<<<<<< HEAD
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
=======
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
>>>>>>> 857c171 (first commit)
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  role: text("role").notNull().default("client"),  // 'client' or 'admin'
  instagram: text("instagram"),
  profilePicture: text("profile_picture"),
});

// Professional model
<<<<<<< HEAD
export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
=======
export const professionals = sqliteTable("professionals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
>>>>>>> 857c171 (first commit)
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  cpf: text("cpf").notNull().unique(),
  address: text("address").notNull(),
  profilePicture: text("profile_picture"),
<<<<<<< HEAD
  active: boolean("active").notNull().default(true),
});

// Service model
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
=======
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

// Service model
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
>>>>>>> 857c171 (first commit)
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  price: real("price").notNull(),
<<<<<<< HEAD
  active: boolean("active").notNull().default(true),
});

// Professional-Service relationship
export const professionalServices = pgTable("professional_services", {
  id: serial("id").primaryKey(),
=======
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

// Professional-Service relationship
export const professionalServices = sqliteTable("professional_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
>>>>>>> 857c171 (first commit)
  professionalId: integer("professional_id").notNull().references(() => professionals.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
});

// Work Schedule for professionals
<<<<<<< HEAD
export const workSchedules = pgTable("work_schedules", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

// Appointment model
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  professionalId: integer("professional_id").notNull().references(() => professionals.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled, no-show
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Financial transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
=======
export const workSchedules = sqliteTable("work_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  professionalId: integer("professional_id").notNull().references(() => professionals.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

// Appointment model
export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  professionalId: integer("professional_id").notNull().references(() => professionals.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled, no-show
  notes: text("notes"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

// Financial transactions
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
>>>>>>> 857c171 (first commit)
  appointmentId: integer("appointment_id").references(() => appointments.id),
  type: text("type").notNull(), // income, expense
  amount: real("amount").notNull(),
  description: text("description").notNull(),
<<<<<<< HEAD
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
=======
  date: text("date").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
>>>>>>> 857c171 (first commit)
});

// Zod schemas for input validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProfessionalSchema = createInsertSchema(professionals).omit({ id: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertProfessionalServiceSchema = createInsertSchema(professionalServices).omit({ id: true });
export const insertWorkScheduleSchema = createInsertSchema(workSchedules).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });

// Auth schemas for login
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;

export type Professional = typeof professionals.$inferSelect;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type ProfessionalService = typeof professionalServices.$inferSelect;
export type InsertProfessionalService = z.infer<typeof insertProfessionalServiceSchema>;

export type WorkSchedule = typeof workSchedules.$inferSelect;
export type InsertWorkSchedule = z.infer<typeof insertWorkScheduleSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

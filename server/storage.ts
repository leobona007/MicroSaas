import { 
  users, type User, type InsertUser,
  professionals, type Professional, type InsertProfessional,
  services, type Service, type InsertService,
  professionalServices, type ProfessionalService, type InsertProfessionalService,
  workSchedules, type WorkSchedule, type InsertWorkSchedule,
  appointments, type Appointment, type InsertAppointment,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Professional operations
  getProfessional(id: number): Promise<Professional | undefined>;
  getAllProfessionals(): Promise<Professional[]>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  updateProfessional(id: number, professional: Partial<InsertProfessional>): Promise<Professional | undefined>;
  deleteProfessional(id: number): Promise<boolean>;
  
  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getAllServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Professional-Service operations
  getProfessionalServices(professionalId: number): Promise<Service[]>;
  getServiceProfessionals(serviceId: number): Promise<Professional[]>;
  addServiceToProfessional(professionalService: InsertProfessionalService): Promise<ProfessionalService>;
  removeServiceFromProfessional(professionalId: number, serviceId: number): Promise<boolean>;
  
  // Schedule operations
  getWorkSchedule(professionalId: number): Promise<WorkSchedule[]>;
  addWorkSchedule(workSchedule: InsertWorkSchedule): Promise<WorkSchedule>;
  updateWorkSchedule(id: number, workSchedule: Partial<InsertWorkSchedule>): Promise<WorkSchedule | undefined>;
  deleteWorkSchedule(id: number): Promise<boolean>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getUserAppointments(userId: number): Promise<Appointment[]>;
  getProfessionalAppointments(professionalId: number): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private professionals: Map<number, Professional>;
  private services: Map<number, Service>;
  private professionalServices: Map<number, ProfessionalService>;
  private workSchedules: Map<number, WorkSchedule>;
  private appointments: Map<number, Appointment>;
  private transactions: Map<number, Transaction>;
  
  // Counters for IDs
  private userIdCounter: number;
  private professionalIdCounter: number;
  private serviceIdCounter: number;
  private professionalServiceIdCounter: number;
  private workScheduleIdCounter: number;
  private appointmentIdCounter: number;
  private transactionIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.professionals = new Map();
    this.services = new Map();
    this.professionalServices = new Map();
    this.workSchedules = new Map();
    this.appointments = new Map();
    this.transactions = new Map();
    
    this.userIdCounter = 1;
    this.professionalIdCounter = 1;
    this.serviceIdCounter = 1;
    this.professionalServiceIdCounter = 1;
    this.workScheduleIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.transactionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add seed data for testing
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Professional operations
  async getProfessional(id: number): Promise<Professional | undefined> {
    return this.professionals.get(id);
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const id = this.professionalIdCounter++;
    const professional: Professional = { ...insertProfessional, id };
    this.professionals.set(id, professional);
    return professional;
  }
  
  async updateProfessional(id: number, updateData: Partial<InsertProfessional>): Promise<Professional | undefined> {
    const existingProfessional = this.professionals.get(id);
    if (!existingProfessional) return undefined;
    
    const updatedProfessional = { ...existingProfessional, ...updateData };
    this.professionals.set(id, updatedProfessional);
    return updatedProfessional;
  }
  
  async deleteProfessional(id: number): Promise<boolean> {
    return this.professionals.delete(id);
  }

  // Service operations
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  async updateService(id: number, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    
    const updatedService = { ...existingService, ...updateData };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Professional-Service operations
  async getProfessionalServices(professionalId: number): Promise<Service[]> {
    const professionalServiceLinks = Array.from(this.professionalServices.values())
      .filter(ps => ps.professionalId === professionalId);
    
    return Promise.all(
      professionalServiceLinks.map(async ps => {
        const service = await this.getService(ps.serviceId);
        if (!service) throw new Error(`Service ${ps.serviceId} not found`);
        return service;
      })
    );
  }

  async getServiceProfessionals(serviceId: number): Promise<Professional[]> {
    const serviceProviders = Array.from(this.professionalServices.values())
      .filter(ps => ps.serviceId === serviceId);
    
    return Promise.all(
      serviceProviders.map(async sp => {
        const professional = await this.getProfessional(sp.professionalId);
        if (!professional) throw new Error(`Professional ${sp.professionalId} not found`);
        return professional;
      })
    );
  }

  async addServiceToProfessional(insertProfessionalService: InsertProfessionalService): Promise<ProfessionalService> {
    const id = this.professionalServiceIdCounter++;
    const professionalService: ProfessionalService = { ...insertProfessionalService, id };
    this.professionalServices.set(id, professionalService);
    return professionalService;
  }

  async removeServiceFromProfessional(professionalId: number, serviceId: number): Promise<boolean> {
    const linkToRemove = Array.from(this.professionalServices.entries())
      .find(([_, ps]) => ps.professionalId === professionalId && ps.serviceId === serviceId);
    
    if (!linkToRemove) return false;
    return this.professionalServices.delete(linkToRemove[0]);
  }

  // Schedule operations
  async getWorkSchedule(professionalId: number): Promise<WorkSchedule[]> {
    return Array.from(this.workSchedules.values())
      .filter(ws => ws.professionalId === professionalId);
  }

  async addWorkSchedule(insertWorkSchedule: InsertWorkSchedule): Promise<WorkSchedule> {
    const id = this.workScheduleIdCounter++;
    const workSchedule: WorkSchedule = { ...insertWorkSchedule, id };
    this.workSchedules.set(id, workSchedule);
    return workSchedule;
  }
  
  async updateWorkSchedule(id: number, updateData: Partial<InsertWorkSchedule>): Promise<WorkSchedule | undefined> {
    const existingSchedule = this.workSchedules.get(id);
    if (!existingSchedule) return undefined;
    
    const updatedSchedule = { ...existingSchedule, ...updateData };
    this.workSchedules.set(id, updatedSchedule);
    return updatedSchedule;
  }
  
  async deleteWorkSchedule(id: number): Promise<boolean> {
    return this.workSchedules.delete(id);
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getUserAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.userId === userId);
  }

  async getProfessionalAppointments(professionalId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.professionalId === professionalId);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.appointments.values())
      .filter(appointment => {
        // Convert the stored date to a string format for comparison
        const appDateStr = new Date(appointment.date).toISOString().split('T')[0];
        return appDateStr === dateString;
      });
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const createdAt = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existingAppointment = this.appointments.get(id);
    if (!existingAppointment) return undefined;
    
    const updatedAppointment = { ...existingAppointment, ...updateData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const createdAt = new Date();
    const transaction: Transaction = { ...insertTransaction, id, createdAt };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existingTransaction = this.transactions.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction = { ...existingTransaction, ...updateData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }
  
  private seedData() {
    // Add an admin user for initial access
    this.createUser({
      username: "admin",
      password: "$2b$10$oByNKDPxe4MRpq7/qCTF5.Oa2iLJSp6BW0I4NL7B1V4JWvYnQjyEm", // "admin123"
      name: "Administrator",
      email: "admin@salao.com",
      role: "admin",
      phone: "",
      address: "",
      instagram: "",
      profilePicture: ""
    });
    
    // Add sample services
    this.createService({
      name: "Haircut",
      description: "Basic haircut with styling",
      duration: 30,
      price: 35.0,
      active: true
    });
    
    this.createService({
      name: "Hair Coloring",
      description: "Full hair coloring service",
      duration: 120,
      price: 100.0,
      active: true
    });
    
    this.createService({
      name: "Manicure",
      description: "Basic manicure service",
      duration: 45,
      price: 25.0,
      active: true
    });
    
    // Add sample professionals
    this.createProfessional({
      name: "John Smith",
      phone: "11 9999-8888",
      email: "john@salao.com",
      cpf: "123.456.789-00",
      address: "123 Main St, City",
      profilePicture: "",
      active: true
    });
    
    this.createProfessional({
      name: "Maria Silva",
      phone: "11 9999-7777",
      email: "maria@salao.com",
      cpf: "987.654.321-00",
      address: "456 Palm Ave, City",
      profilePicture: "",
      active: true
    });
    
    // Assign services to professionals
    this.addServiceToProfessional({
      professionalId: 1,
      serviceId: 1
    });
    
    this.addServiceToProfessional({
      professionalId: 1,
      serviceId: 2
    });
    
    this.addServiceToProfessional({
      professionalId: 2,
      serviceId: 2
    });
    
    this.addServiceToProfessional({
      professionalId: 2,
      serviceId: 3
    });
    
    // Set work schedules
    for (let i = 1; i <= 5; i++) { // Monday to Friday
      this.addWorkSchedule({
        professionalId: 1,
        dayOfWeek: i,
        startTime: '09:00:00',
        endTime: '18:00:00'
      });
      
      this.addWorkSchedule({
        professionalId: 2,
        dayOfWeek: i,
        startTime: '10:00:00',
        endTime: '19:00:00'
      });
    }
  }
}

export const storage = new MemStorage();

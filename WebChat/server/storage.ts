import { type User, type InsertUser, type FocusSession, type InsertFocusSession, type UpdateFocusSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Focus session methods
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  updateFocusSession(sessionId: string, updates: UpdateFocusSession): Promise<FocusSession | undefined>;
  getFocusSession(sessionId: string): Promise<FocusSession | undefined>;
  getFocusSessionsByUser(userId: string, startDate?: Date, endDate?: Date): Promise<FocusSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private focusSessions: Map<string, FocusSession>;

  constructor() {
    this.users = new Map();
    this.focusSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const id = randomUUID();
    const session: FocusSession = {
      ...insertSession,
      id,
      durationActual: insertSession.durationActual ?? null,
      endedAt: insertSession.endedAt ?? null,
      createdAt: new Date(),
    };
    this.focusSessions.set(id, session);
    return session;
  }

  async updateFocusSession(sessionId: string, updates: UpdateFocusSession): Promise<FocusSession | undefined> {
    const session = this.focusSessions.get(sessionId);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.focusSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getFocusSession(sessionId: string): Promise<FocusSession | undefined> {
    return this.focusSessions.get(sessionId);
  }

  async getFocusSessionsByUser(userId: string, startDate?: Date, endDate?: Date): Promise<FocusSession[]> {
    const sessions = Array.from(this.focusSessions.values()).filter(
      (session) => session.userId === userId
    );

    if (startDate || endDate) {
      return sessions.filter(session => {
        const sessionDate = new Date(session.startedAt);
        if (startDate && sessionDate < startDate) return false;
        if (endDate && sessionDate > endDate) return false;
        return true;
      });
    }

    return sessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }
}

export const storage = new MemStorage();

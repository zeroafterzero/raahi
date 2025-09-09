import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFocusSessionSchema, updateFocusSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // COPY NOTE: When moving into capellapro monorepo, move to packages/server/controllers or keep here under apps/web/pages/api/focus/

  // POST /api/focus/start - Start a new focus session
  app.post("/api/focus/start", async (req, res) => {
    console.debug("POST /api/focus/start", req.body);
    
    try {
      const sessionData = insertFocusSessionSchema.parse(req.body);
      
      // TODO: When moving to Firebase, replace with firebase-admin logic
      // Check for USE_FIREBASE env var and switch accordingly
      const useFirebase = process.env.USE_FIREBASE === 'true';
      
      if (useFirebase) {
        // TODO: Initialize firebase-admin with FIREBASE_SERVICE_ACCOUNT
        // const admin = require('firebase-admin');
        // const db = admin.firestore();
        // const sessionRef = await db.collection('focus_sessions').add(sessionData);
        // return res.json({ sessionId: sessionRef.id });
        console.debug("Firebase not configured, falling back to in-memory storage");
      }
      
      const session = await storage.createFocusSession(sessionData);
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error starting focus session:", error);
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  // POST /api/focus/end - End a focus session
  app.post("/api/focus/end", async (req, res) => {
    console.debug("POST /api/focus/end", req.body);
    
    try {
      const { sessionId, ...updates } = req.body;
      const updateData = updateFocusSessionSchema.parse(updates);
      
      const useFirebase = process.env.USE_FIREBASE === 'true';
      
      if (useFirebase) {
        // TODO: Update Firebase document
        console.debug("Firebase not configured, falling back to in-memory storage");
      }
      
      const updatedSession = await storage.updateFocusSession(sessionId, updateData);
      
      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Error ending focus session:", error);
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // GET /api/focus/stats - Get focus statistics
  app.get("/api/focus/stats", async (req, res) => {
    console.debug("GET /api/focus/stats", req.query);
    
    try {
      const { range = 'today', userId = 'default-user' } = req.query;
      
      const useFirebase = process.env.USE_FIREBASE === 'true';
      
      if (useFirebase) {
        // TODO: Query Firebase for stats
        console.debug("Firebase not configured, falling back to in-memory storage");
      }
      
      let startDate: Date;
      const endDate = new Date();
      
      if (range === 'today') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      } else if (range === 'week') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
      }
      
      const sessions = await storage.getFocusSessionsByUser(userId as string, startDate, endDate);
      
      // Calculate stats
      const completedSessions = sessions.filter(s => s.completed);
      const todayMinutes = Math.round(
        completedSessions
          .filter(s => {
            const sessionDate = new Date(s.startedAt);
            const today = new Date();
            return sessionDate.toDateString() === today.toDateString();
          })
          .reduce((sum, s) => sum + (s.durationActual || 0), 0) / 60
      );
      
      const completedCycles = completedSessions.filter(s => s.sessionType === 'focus').length;
      
      // Calculate streak (consecutive days with completed sessions)
      const dailyCompletions = new Map<string, boolean>();
      completedSessions.forEach(session => {
        const dateKey = new Date(session.startedAt).toDateString();
        dailyCompletions.set(dateKey, true);
      });
      
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = checkDate.toDateString();
        
        if (dailyCompletions.has(dateKey)) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      const avgSession = completedSessions.length > 0 
        ? Math.round(completedSessions.reduce((sum, s) => sum + (s.durationActual || 0), 0) / completedSessions.length / 60)
        : 0;
      
      const stats = {
        todayMinutes,
        completedCycles,
        currentStreak,
        avgSession,
        lastSessions: sessions.slice(0, 10),
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching focus stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // POST /api/focus/export - Export focus data
  app.post("/api/focus/export", async (req, res) => {
    console.debug("POST /api/focus/export", req.body);
    
    try {
      const { format = 'csv', userId = 'default-user', range = 'month' } = req.body;
      
      let startDate = new Date();
      if (range === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else {
        startDate.setDate(startDate.getDate() - 30);
      }
      startDate.setHours(0, 0, 0, 0);
      
      const sessions = await storage.getFocusSessionsByUser(userId, startDate);
      
      if (format === 'csv') {
        const csvHeader = 'Date,Session Type,Duration Requested (min),Duration Actual (min),Completed\n';
        const csvRows = sessions.map(session => {
          const date = new Date(session.startedAt).toLocaleDateString();
          const durationReq = Math.round(session.durationRequested / 60);
          const durationAct = Math.round((session.durationActual || 0) / 60);
          return `${date},${session.sessionType},${durationReq},${durationAct},${session.completed}`;
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="focus-sessions.csv"');
        res.send(csvContent);
      } else {
        // For PDF, return base64 content (simplified)
        res.json({ 
          content: Buffer.from(`Focus Sessions Report\n\nGenerated: ${new Date().toLocaleDateString()}\nTotal Sessions: ${sessions.length}`).toString('base64'),
          filename: 'focus-sessions.pdf'
        });
      }
    } catch (error) {
      console.error("Error exporting focus data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

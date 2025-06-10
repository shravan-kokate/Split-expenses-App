import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Expense Management Routes
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json({
        success: true,
        data: expenses,
        message: "Expenses retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expenses",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json({
        success: true,
        data: expense,
        message: "Expense added successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to create expense",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense ID"
        });
      }

      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, validatedData);
      
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found"
        });
      }

      res.json({
        success: true,
        data: expense,
        message: "Expense updated successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update expense",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense ID"
        });
      }

      const deleted = await storage.deleteExpense(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Expense not found"
        });
      }

      res.json({
        success: true,
        message: "Expense deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete expense",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // People Routes
  app.get("/api/people", async (req, res) => {
    try {
      const people = await storage.getPeople();
      res.json({
        success: true,
        data: people,
        message: "People retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve people",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Balance and Settlement Routes
  app.get("/api/balances", async (req, res) => {
    try {
      const balances = await storage.getPersonBalances();
      res.json({
        success: true,
        data: balances,
        message: "Balances calculated successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to calculate balances",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/settlements", async (req, res) => {
    try {
      const settlements = await storage.getSettlementSummary();
      res.json({
        success: true,
        data: settlements,
        message: "Settlement summary calculated successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to calculate settlements",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Settlement history
  app.get("/api/settlements/history", async (req, res) => {
    try {
      const settlements = await storage.getSettlements();
      res.json({
        success: true,
        data: settlements,
        message: "Settlement history retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve settlement history",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/settlements/:id/mark-paid", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid settlement ID"
        });
      }

      const updated = await storage.markSettlementPaid(id);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Settlement not found"
        });
      }

      res.json({
        success: true,
        message: "Settlement marked as paid"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to mark settlement as paid",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

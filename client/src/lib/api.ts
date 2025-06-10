import { apiRequest } from "./queryClient";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: any[];
  error?: string;
}

export const api = {
  expenses: {
    getAll: () => fetch("/api/expenses").then(res => res.json()),
    create: (expense: any) => apiRequest("POST", "/api/expenses", expense),
    update: (id: number, expense: any) => apiRequest("PUT", `/api/expenses/${id}`, expense),
    delete: (id: number) => apiRequest("DELETE", `/api/expenses/${id}`),
  },
  people: {
    getAll: () => fetch("/api/people").then(res => res.json()),
  },
  balances: {
    getAll: () => fetch("/api/balances").then(res => res.json()),
  },
  settlements: {
    getSummary: () => fetch("/api/settlements").then(res => res.json()),
    getHistory: () => fetch("/api/settlements/history").then(res => res.json()),
    markPaid: (id: number) => apiRequest("POST", `/api/settlements/${id}/mark-paid`),
  },
};

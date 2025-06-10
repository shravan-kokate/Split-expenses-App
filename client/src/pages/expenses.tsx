import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import AddExpenseModal from "@/components/expense/add-expense-modal";
import ExpenseTable from "@/components/expense/expense-table";
import type { Expense } from "@/lib/types";

export default function Expenses() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: expensesResponse, isLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: () => api.expenses.getAll(),
  });

  const { data: peopleResponse } = useQuery({
    queryKey: ["/api/people"],
    queryFn: () => api.people.getAll(),
  });

  const expenses: Expense[] = expensesResponse?.data || [];
  const people = peopleResponse?.data || [];

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      if (filterBy === "all") return true;
      return expense.paid_by === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "amount-high":
          return parseFloat(b.amount) - parseFloat(a.amount);
        case "amount-low":
          return parseFloat(a.amount) - parseFloat(b.amount);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

 // ...existing code...
return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-100 min-h-screen">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Expenses</h1>
      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow px-6 py-3 text-lg"
        onClick={() => setIsAddExpenseModalOpen(true)}
      >
        <Plus className="mr-3 h-5 w-5" />
        Add Expense
      </Button>
    </div>

    {/* Expense Filters */}
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center space-x-3">
            <label className="text-base font-semibold text-blue-800">Filter by:</label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-44 bg-blue-50 border-blue-200 rounded-lg">
                <SelectValue placeholder="All People" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All People</SelectItem>
                {people.map((person) => (
                  <SelectItem key={person.name} value={person.name}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-base font-semibold text-blue-800">Sort by:</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-56 bg-blue-50 border-blue-200 rounded-lg">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Expenses Table */}
    <div className="shadow-xl rounded-xl bg-white/90 backdrop-blur mb-8">
      <ExpenseTable expenses={filteredAndSortedExpenses} />
    </div>

    <AddExpenseModal 
      open={isAddExpenseModalOpen} 
      onOpenChange={setIsAddExpenseModalOpen} 
    />
  </div>
);
// ...existing code...
}

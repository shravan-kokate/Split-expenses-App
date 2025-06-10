import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ArrowRightLeft, Plus, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { Link } from "wouter";
import { useState } from "react";
import AddExpenseModal from "@/components/expense/add-expense-modal";
import type { Expense, PersonBalance, SettlementSummary } from "@/lib/types";

export default function Dashboard() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const { data: expensesResponse, isLoading: expensesLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: () => api.expenses.getAll(),
  });

  const { data: balancesResponse, isLoading: balancesLoading } = useQuery({
    queryKey: ["/api/balances"],
    queryFn: () => api.balances.getAll(),
  });

  const { data: settlementsResponse, isLoading: settlementsLoading } = useQuery({
    queryKey: ["/api/settlements"],
    queryFn: () => api.settlements.getSummary(),
  });

  const expenses: Expense[] = expensesResponse?.data || [];
  const balances: PersonBalance[] = balancesResponse?.data || [];
  const settlements: SettlementSummary[] = settlementsResponse?.data || [];

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalPeople = balances.length;
  const pendingSettlements = settlements.length;

  const recentExpenses = expenses.slice(-3).reverse();

  if (expensesLoading || balancesLoading || settlementsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

 // ...existing code...
return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-100 min-h-screen">
    {/* Dashboard Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <BarChart3 className="text-white text-2xl" />
            </div>
            <div className="ml-6">
              <p className="text-base font-semibold text-blue-700">Total Expenses</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">₹{totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <Users className="text-white text-2xl" />
            </div>
            <div className="ml-6">
              <p className="text-base font-semibold text-green-700">Active People</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalPeople}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex items-center">
            <div className="p-3 bg-amber-400 rounded-xl shadow-lg">
              <ArrowRightLeft className="text-white text-2xl" />
            </div>
            <div className="ml-6">
              <p className="text-base font-semibold text-amber-700">Pending Settlements</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{pendingSettlements}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Quick Actions & Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Quick Add Expense */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-100 via-white to-purple-100">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-800">Quick Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
            onClick={() => setIsAddExpenseModalOpen(true)}
          >
            <Plus className="mr-3 h-5 w-5" />
            Add New Expense
          </Button>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-100 via-white to-blue-100">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-purple-800">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {recentExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No expenses yet</p>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-white/80 rounded-xl shadow">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-4 shadow">
                      <BarChart3 className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">Paid by <span className="font-medium text-blue-700">{expense.paid_by}</span></p>
                    </div>
                  </div>
                  <p className="font-bold text-blue-700 text-lg">₹{parseFloat(expense.amount).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/expenses">
            <Button variant="ghost" className="w-full mt-6 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold">
              <Eye className="mr-2 h-5 w-5" />
              View All Expenses
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>

    {/* Current Balances Summary */}
    <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Current Balances</CardTitle>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No balances available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {balances.map((person) => (
              <div key={person.name} className="p-6 bg-gradient-to-br from-gray-100 via-white to-blue-50 border-0 rounded-xl shadow flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 shadow">
                    <span className="font-bold text-gray-700 text-xl">
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-lg">{person.name}</p>
                </div>
                <p className={`font-bold text-lg ${
                  person.balance > 0 ? "text-green-600" : person.balance < 0 ? "text-red-600" : "text-gray-600"
                }`}>
                  {person.balance > 0 ? "+" : ""}₹{Math.abs(person.balance).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    <AddExpenseModal 
      open={isAddExpenseModalOpen} 
      onOpenChange={setIsAddExpenseModalOpen} 
    />
  </div>
);
// ...existing code...
}

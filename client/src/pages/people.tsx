import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { api } from "@/lib/api";
import type { PersonBalance } from "@/lib/types";

export default function People() {
  const { data: balancesResponse, isLoading: balancesLoading } = useQuery({
    queryKey: ["/api/balances"],
    queryFn: () => api.balances.getAll(),
  });

  const { data: expensesResponse, isLoading: expensesLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: () => api.expenses.getAll(),
  });

  const balances: PersonBalance[] = balancesResponse?.data || [];
  const expenses = expensesResponse?.data || [];

  const totalExpenseAmount = expenses.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0);
  const averagePerPerson = balances.length > 0 ? totalExpenseAmount / balances.length : 0;

  if (balancesLoading || expensesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">People</h1>
        <p className="text-blue-800 font-medium">Everyone involved in expense splitting</p>
      </div>

      {/* People Grid */}
      {balances.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-10 text-center">
            <Users className="mx-auto h-14 w-14 text-blue-300 mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No people yet</h3>
            <p className="text-blue-700">People will appear here automatically when you add expenses.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {balances.map((person) => (
              <Card key={person.name} className="shadow-xl border-0 bg-white/90 backdrop-blur">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-5 shadow">
                      <span className="text-2xl font-bold text-blue-700">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">{person.name}</h3>
                      <p className="text-sm text-blue-600">Group Member</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-base text-blue-700">Total Paid:</span>
                      <span className="font-semibold text-blue-900">₹{person.totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-blue-700">Fair Share:</span>
                      <span className="font-semibold text-blue-900">₹{person.totalOwed.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-blue-700">Balance:</span>
                      <span className={`font-bold ${
                        person.balance > 0 ? "text-green-600" : person.balance < 0 ? "text-red-600" : "text-gray-600"
                      }`}>
                        {person.balance > 0 ? "+" : ""}₹{person.balance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-blue-700">Expenses Count:</span>
                      <span className="font-semibold text-blue-900">{person.expenseCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* People Statistics */}
          <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-900">Group Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-blue-700">{balances.length}</p>
                  <p className="text-base text-blue-800">Total People</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-green-600">₹{totalExpenseAmount.toFixed(2)}</p>
                  <p className="text-base text-blue-800">Total Expenses</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-amber-500">₹{averagePerPerson.toFixed(2)}</p>
                  <p className="text-base text-blue-800">Average Per Person</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-purple-700">{expenses.length}</p>
                  <p className="text-base text-blue-800">Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
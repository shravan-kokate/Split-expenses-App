import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, CheckCircle, History } from "lucide-react";
import { api } from "@/lib/api";
import type { SettlementSummary, Settlement } from "@/lib/types";

export default function Settlements() {
  const { data: settlementsResponse, isLoading } = useQuery({
    queryKey: ["/api/settlements"],
    queryFn: () => api.settlements.getSummary(),
  });

  const { data: historyResponse, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/settlements/history"],
    queryFn: () => api.settlements.getHistory(),
  });

  const settlements: SettlementSummary[] = settlementsResponse?.data || [];
  const history: Settlement[] = historyResponse?.data || [];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">Settlements</h1>
        <p className="text-blue-800 font-medium">Optimized transactions to settle all debts with minimal transfers</p>
      </div>

      {/* Settlement Summary */}
      <Card className="mb-10 shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-800">Settlement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto h-14 w-14 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">All settled up!</h3>
              <p className="text-blue-700">No pending settlements required.</p>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {settlements.map((settlement, index) => (
                  <div key={index} className="flex items-center justify-between p-5 bg-white/90 rounded-xl shadow">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-5 shadow">
                        <span className="font-bold text-blue-700 text-xl">
                          {settlement.from.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          <span className="text-red-600">{settlement.from}</span> owes{" "}
                          <span className="text-green-600">{settlement.to}</span>
                        </p>
                        <p className="text-sm text-blue-700">Settlement Payment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">₹{settlement.amount.toFixed(2)}</p>
                      <Button variant="ghost" size="sm" className="text-blue-700 hover:underline mt-2">
                        Mark as Paid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-5 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <InfoIcon className="text-blue-700 mr-3" size={22} />
                  <p className="text-base text-blue-800">
                    <strong>Total settlements needed:</strong> {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} to clear all debts
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Settlement History */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-purple-800">Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-3"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-blue-700">
              <History className="mx-auto h-14 w-14 mb-4" />
              <p>No settlement history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((settlement) => (
                <div key={settlement.id} className="flex items-center justify-between p-4 bg-white/90 rounded-xl shadow">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {settlement.from_person} paid {settlement.to_person}
                      </p>
                      <p className="text-sm text-blue-700">
                        {new Date(settlement.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-green-600">₹{parseFloat(settlement.amount).toFixed(2)}</p>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Settled
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
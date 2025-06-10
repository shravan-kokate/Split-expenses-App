import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Utensils, ShoppingCart, Car, Film, Pizza } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Expense } from "@/lib/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
}

const getCategoryIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("dinner") || desc.includes("food") || desc.includes("restaurant")) {
    return <Utensils className="text-blue-600" size={16} />;
  }
  if (desc.includes("groceries") || desc.includes("shopping")) {
    return <ShoppingCart className="text-green-600" size={16} />;
  }
  if (desc.includes("petrol") || desc.includes("gas") || desc.includes("fuel")) {
    return <Car className="text-red-600" size={16} />;
  }
  if (desc.includes("movie") || desc.includes("film") || desc.includes("cinema")) {
    return <Film className="text-purple-600" size={16} />;
  }
  if (desc.includes("pizza")) {
    return <Pizza className="text-orange-600" size={16} />;
  }
  return <Utensils className="text-blue-600" size={16} />;
};

const getSplitTypeBadge = (splitType: string) => {
  switch (splitType) {
    case "equal":
      return <Badge variant="secondary">Equal Split</Badge>;
    case "percentage":
      return <Badge variant="outline">By Percentage</Badge>;
    case "exact":
      return <Badge variant="default">Exact Amounts</Badge>;
    default:
      return <Badge variant="secondary">Equal Split</Badge>;
  }
};

export default function ExpenseTable({ expenses, onEdit }: ExpenseTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.expenses.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settlements"] });
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpenseMutation.mutate(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Add your first expense to get started with splitting costs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Split Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      {getCategoryIcon(expense.description)}
                    </div>
                    <span className="font-medium text-gray-900">{expense.description}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  ₹{parseFloat(expense.amount).toFixed(2)}
                </TableCell>
                <TableCell className="text-gray-900">{expense.paid_by}</TableCell>
                <TableCell>{getSplitTypeBadge(expense.split_type)}</TableCell>
                <TableCell className="text-gray-500">
                  {new Date(expense.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(expense)}
                        className="text-primary hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteExpenseMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

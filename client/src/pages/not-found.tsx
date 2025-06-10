import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <Card className="w-full max-w-md mx-4 shadow-xl border-0 bg-white/90 backdrop-blur">
        <CardContent className="pt-8 pb-8">
          <div className="flex mb-4 gap-3 items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h1 className="text-3xl font-extrabold text-blue-900">404 Not Found</h1>
          </div>
          <p className="mt-4 text-base text-gray-700 text-center">
            Oops! The page you are looking for does not exist.<br />
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
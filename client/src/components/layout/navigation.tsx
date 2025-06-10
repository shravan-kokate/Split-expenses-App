import { Link, useLocation } from "wouter";
import { Receipt, BarChart3, Users, CreditCard } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/expenses", label: "Expenses", icon: Receipt },
    { path: "/settlements", label: "Settlements", icon: CreditCard },
    { path: "/people", label: "People", icon: Users },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-100 via-white to-purple-100 shadow-sm border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Receipt className="text-blue-700 text-3xl mr-3 drop-shadow" />
            <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Expense-Split-Master</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-semibold px-2 pb-2 flex items-center gap-2 transition-colors duration-200 ${
                    isActive
                      ? "text-blue-700 border-b-4 border-blue-700 bg-blue-50 rounded-t"
                      : "text-blue-800/70 hover:text-blue-900 hover:bg-blue-100 rounded-t"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button className="md:hidden text-blue-700 hover:text-blue-900">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
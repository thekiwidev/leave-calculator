//@component: Header component for the application
import { Calendar } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Advanced Leave Calculator
            </h1>
            <p className="text-sm text-gray-600">
              Calculate working days, excluding weekends and public holidays
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

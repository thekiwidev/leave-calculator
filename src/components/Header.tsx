//@component: Header component for the application
import { Calculator } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-zinc-900 to-black shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Leave Calculator</h1>
            <p className="text-blue-100 text-sm">
              Made by Adedotun for OSGF Leave Matters Unit - Making leave
              drafting easier
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

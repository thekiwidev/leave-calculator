//@component: Main App component for the Advanced Leave Calculator
import { useEffect } from "react";
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { LeaveCalculatorForm } from "@/components/LeaveCalculatorForm";
import { LeaveResults } from "@/components/LeaveResults";
import { PublicHolidayManager } from "@/components/PublicHolidayManager";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function App() {
  const initializeStore = useLeaveCalculatorStore(
    (state) => state.initializeStore
  );

  // Initialize the store when the app loads
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Leave Calculator Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Calculate Your Leave
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LeaveCalculatorForm />
              <LeaveResults />
            </div>
          </section>

          {/* Public Holiday Management Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Manage Public Holidays
            </h2>
            <PublicHolidayManager />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

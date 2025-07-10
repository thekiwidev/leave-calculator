//@component: Main App component for the Advanced Leave Calculator
import { useEffect } from "react";
import { useLeaveCalculatorStore } from "@/store/useLeaveCalculatorStore";
import { LeaveCalculatorForm } from "@/components/LeaveCalculatorForm";
import { LeaveResults } from "@/components/LeaveResults";
import { PublicHolidayManager } from "@/components/PublicHolidayManager";
import { NotPublicHolidayManager } from "@/components/NotPublicHolidayManager";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

function App() {
  const initializeStore = useLeaveCalculatorStore(
    (state) => state.initializeStore
  );

  // Initialize the store when the app loads
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Leave Calculator Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Calculate Your Leave</h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <LeaveCalculatorForm />
              </div>
              <div className="xl:col-span-2">
                <LeaveResults />
              </div>
            </div>
          </section>

          {/* Public Holiday Management Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Manage Public Holidays</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <PublicHolidayManager />
              <NotPublicHolidayManager />
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* PWA Install Banner */}
      <PWAInstallBanner />
    </div>
  );
}

export default App;

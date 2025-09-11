//@component: Keep-alive test component for manual testing
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { testKeepAlive } from "@/utils/keepAlive";

interface KeepAliveTestResult {
  success: boolean;
  message: string;
  timestamp: string;
}

const KeepAliveTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KeepAliveTestResult | null>(null);

  // @handler: Test keep-alive functionality
  const handleTestKeepAlive = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Test keep-alive functionality (logs to console)
      await testKeepAlive();
      // Get actual result from pingSupabaseKeepAlive
      const { pingSupabaseKeepAlive } = await import("@/utils/keepAlive");
      const pingResult = await pingSupabaseKeepAlive();
      setResult(pingResult);
    } catch (error) {
      setResult({
        success: false,
        message: `Test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development or if admin secret is provided
  const showTestButton =
    import.meta.env.DEV ||
    (import.meta.env.VITE_ADMIN_SECRET_KEY &&
      import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

  if (!showTestButton) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-4">
      <h3 className="text-lg font-semibold mb-2">Supabase Keep-Alive Test</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Test the database keep-alive functionality to ensure it's working
        correctly.
      </p>

      <Button
        onClick={handleTestKeepAlive}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading ? "Testing..." : "Test Keep-Alive"}
      </Button>

      {result && (
        <div
          className={`mt-3 p-3 rounded-lg ${
            result.success
              ? "bg-green-100 border border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
              : "bg-red-100 border border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">{result.success ? "✅" : "❌"}</span>
            <div>
              <p className="font-medium">
                {result.success ? "Keep-alive successful" : "Keep-alive failed"}
              </p>
              <p className="text-sm opacity-90">{result.message}</p>
              <p className="text-xs opacity-75">
                {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeepAliveTest;

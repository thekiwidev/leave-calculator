//@component: Footer component for the application
import { ExternalLink, Mail, Globe, RotateCcw } from "lucide-react";

export function Footer() {
  // @helper: refresh app while preserving localStorage
  const handleRefreshApp = async () => {
    try {
      // Clear all caches but preserve localStorage
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      // Force reload the page to get fresh content
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing app:", error);
      // Fallback to simple reload
      window.location.reload();
    }
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium">
            Leave Calculator - Made for OSGF Leave Matters Unit
          </p>
          <p>
            Built with ❤️ by{" "}
            <a
              href="https://adedotun.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Adedotun Gabriel
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="flex justify-center items-center gap-4 pt-2">
            <a
              href="https://adedotun.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">Website</span>
            </a>
            <a
              href="mailto:thekiwidev@adedotun.xyz"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-xs">Contact</span>
            </a>
            <button
              onClick={handleRefreshApp}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              title="Refresh app and clear cache (preserves your holidays)"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs">Refresh</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground/70 pt-2">
            React • TypeScript • Tailwind CSS • PWA • Supabase • Vite
          </p>
        </div>
      </div>
    </footer>
  );
}

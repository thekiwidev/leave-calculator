//@component: Footer component for the application
import { ExternalLink, Mail, Globe } from "lucide-react";

export function Footer() {
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
          </div>
          <p className="text-xs text-muted-foreground/70 pt-2">
            React • TypeScript • Tailwind CSS • PWA
          </p>
        </div>
      </div>
    </footer>
  );
}

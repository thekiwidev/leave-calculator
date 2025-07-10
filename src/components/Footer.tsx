//@component: Footer component for the application
export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Advanced Leave Calculator v1.1 - Built with React, TypeScript, and
            Tailwind CSS
          </p>
          <p className="mt-1">
            Designed for accurate leave calculation with Nigerian public
            holidays
          </p>
        </div>
      </div>
    </footer>
  );
}

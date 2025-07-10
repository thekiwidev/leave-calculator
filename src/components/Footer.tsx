//@component: Footer component for the application
export function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center text-sm text-gray-600">
          <p>
            Advanced Leave Calculator v1.0 - Built with React, TypeScript, and
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

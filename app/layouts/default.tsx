import { Navbar } from "../components/navbar.tsx";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center pt-16">
      <div className="flex-1 flex flex-col items-center gap-6 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <Navbar />
        </header>
        <div className="w-full max-w-4xl px-4">
          {children}
        </div>
      </div>
    </main>
  );
}

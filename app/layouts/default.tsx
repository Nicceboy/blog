import { Navbar } from "../components/navbar.tsx";
import { Sidenotes } from "~/components/sidenotes.tsx";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-left pt-10">
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start max-w-screen-xl w-full gap-6">
        <header className="flex lg:flex-col items-center sticky">
          <Navbar />
        </header>
        <div className="flex-1 max-w-4xl px-3 relative">
          <div className="flex flex-row">
            <div className="prose">
              {children}
            </div>
            <Sidenotes />
          </div>
        </div>
      </div>
    </main>
  );
}

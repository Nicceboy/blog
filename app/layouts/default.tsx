import { Navbar } from "~/components/navbar.tsx";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-left pt-[1rem] md:pt-[3rem] ">
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start max-w-screen-lg w-full gap-[1rem]">
        <header className="flex flex-col items-center sticky">
          <Navbar />
        </header>
      <div className="flex-1  max-w-screen px-[1rem] relative">
            {children}
      </div>
      </div>
    </main>
  );
}

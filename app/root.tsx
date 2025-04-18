import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root.ts";
import "./styles/main.css";

export const links: Route.LinksFunction = () => [];

// Simple non-blocking script to prevent theme flash
const themeInitScript = `
  (function() {
    let theme = localStorage.getItem("theme") || "system";
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
  })()
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>A blog about something</title>
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="text-shadow-default-text dark:text-default-text font-normal text-xl min-h-screen flex flex-col bg-white dark:bg-black">
        <div className="flex-grow">
          {children}
          <ScrollRestoration />
          <Scripts />
        </div>
        <footer className="w-full py-4 text-sm text-black dark:text-gray-500 text-center bg-opacity-50 backdrop-blur-sm z-10">
          <div className="container mx-auto">
            <div className="px-4 flex flex-col items-center justify-center gap-1 max-w-xl mx-auto">
              <p>
                Except where otherwise noted, content on this site is licensed
                under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  className="text-red-my-for-light dark:text-red-my hover:text-red-my-hover underline"
                  target="_blank"
                  rel="license noopener noreferrer"
                >
                  CC BY 4.0
                </a>{" "}
                © {new Date().getFullYear()} Niklas Saari
              </p>
              <p>
                <span>
                  This website does not collect data or use any third-party
                  APIs.
                </span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404
      ? "The requested page could not be found..."
      : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

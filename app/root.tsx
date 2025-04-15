import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "react-router/app/+types/root.ts";
import "./styles/main.css";

export const links: Route.LinksFunction = () => [
  // Example
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  //   crossOrigin: "anonymous",
  // },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <title>A blog about something</title>
      <body className="text-default-text font-normal text-xl min-h-screen flex flex-col">
        <div className="flex-grow">
          {children}
          <ScrollRestoration />
          <Scripts />
        </div>
        <footer className="w-full py-4 text-sm text-gray-500 text-center bg-black bg-opacity-90 backdrop-blur-sm z-10">
          <div className="container mx-auto">
            <div className="px-4 flex flex-col items-center justify-center gap-1 max-w-xl mx-auto">
              <p>
                Except where otherwise noted, content on this site is licensed
                under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  className="text-red-my hover:text-red-my-hover underline"
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

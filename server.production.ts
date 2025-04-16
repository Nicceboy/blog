import { serveFile } from "@std/http/file-server";
import { join } from "@std/path/join";
import { createRequestHandler } from "react-router";

// Create a request handler from your React Router build.
const handleRequest = createRequestHandler(
  // @ts-expect-error - build output
  await import("./build/server/index.js"),
  "production",
);

// Common function to process requests on the HTTPS server
async function processRequest(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;

  try {
    const filePath = join("./build/client", pathname);
    const fileInfo = await Deno.stat(filePath);

    if (fileInfo.isDirectory) {
      throw new Deno.errors.NotFound();
    }

    const response = await serveFile(request, filePath, { fileInfo });

    if (pathname.startsWith("/assets/")) {
      response.headers.set(
        "cache-control",
        "public, max-age=31536000, immutable",
      );
    } else {
      response.headers.set("cache-control", "public, max-age=600");
    }

    return response;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  // Fall back to the React Router handler.
  return handleRequest(request);
}

// HTTP server (port 80) - simply redirect to HTTPS.
async function startHttpServer() {
  const httpPort = 80;
  console.log(`HTTP server listening on port ${httpPort}`);

  // Deno.serve returns a promise that runs forever.
  Deno.serve({ port: httpPort }, (request: Request) => {
    const url = new URL(request.url);
    // Change protocol to https.
    url.protocol = "https:";
    // Optionally, adjust the port if needed
    url.port = ""; // empty string implies default port 443 for https
    return new Response(null, {
      status: 301,
      headers: { "Location": url.toString() },
    });
  });
}

// HTTPS server (port 443) that uses TLS.
async function startHttpsServer() {
  const tlsOptions = {
    port: 443,
    cert: "/etc/letsencrypt/live/dev.nicce.dev/fullchain.pem",
    key: "/etc/letsencrypt/live/dev.nicce.dev/privkey.pem",
  };
  console.log(`HTTPS server listening on port ${tlsOptions.port}`);
  Deno.serve(tlsOptions, processRequest);
}

// Start both servers concurrently.
Promise.all([
  startHttpServer(),
  startHttpsServer(),
]).catch((err) => {
  console.error("Server error:", err);
});
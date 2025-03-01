import type { Route } from "+types/robots.ts";
import { readDataFile } from "~/lib/file_read.ts";

// Serves the robots.txt and excludes many AI bots from crawling the site
export async function loader(
  {}: Route.LoaderArgs,
) {
  const aiRules = await readDataFile("robots", "ai.txt");
  const robotText = [
    aiRules,
    "User-agent: *",
    "Allow: /",
  ].join("\n");

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "max-age=300, s-maxage=3600",
    },
  });
}

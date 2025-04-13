import { readDataFile } from "~/lib/file_read.ts";

// Export the loader function for use in the route configuration
export const loader = async () => {
  const aiRules = await readDataFile("robots", "robots.txt");
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
};

import { Post } from "~/welcome/welcome.tsx";
import type { Route } from "./+types/home.ts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "A blog about something" },
    { name: "description", content: "Welcome to my website!" },
  ];
}

export function loader() {
  return {
    message: `Hello from Deno ${
      Deno.version.deno ? `v${Deno.version.deno}` : "Deploy"
    }`,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Post message={loaderData.message} />;
}

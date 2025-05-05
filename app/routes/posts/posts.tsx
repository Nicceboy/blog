import { PageLayout } from "~/layouts/default.tsx";
import { PostsLayout } from "./posts_layout.tsx";

export default function HomePage() {
  return (
    <PageLayout>
      <PostsLayout />
    </PageLayout>
  );
}

export function meta() {
  return [
    { title: "A blog about something" },
    {
      name: "description",
      content: "Welcome to my blog!",
    },
    {
      name: "author",
      content: "Niklas Saari",
    },
  ];
}
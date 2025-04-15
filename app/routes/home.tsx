import { PageLayout } from "~/layouts/default.tsx";
import { PostsLayout } from "~/layouts/posts.tsx";

export default function HomePage() {
  return (
    <PageLayout>
      <PostsLayout />
    </PageLayout>
  );
}

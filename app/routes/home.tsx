import { PageLayout } from "~/layouts/default.tsx";
import * as HelloPost from "~/posts/mtg_containers/index.mdx";

// import * as HelloPost from "~/posts/footnote-example.mdx";
// import * as HelloPost from "~/posts/hello.mdx";
import { PostContainer } from "~/layouts/post.tsx";
import Components from "../typography.tsx";

export default function HomePage() {
  return (
    <PageLayout>
      <PostContainer meta={HelloPost.metadata}>
        <HelloPost.default components={Components} />
      </PostContainer>
    </PageLayout>
  );
}

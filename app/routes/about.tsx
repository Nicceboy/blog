import { PageLayout } from "../layouts/default.tsx";
import * as About from "~/posts/about.mdx";
import { MDXProvider } from "@mdx-js/react";
import Components from "~/typography.tsx";

const AboutPage: React.FC = () => {
  return (
    <PageLayout>
      <title>About this page</title>
      <section className="prose box-border">
        <MDXProvider components={Components}>
          <About.default components={Components} />
        </MDXProvider>
      </section>
    </PageLayout>
  );
};

export default AboutPage;

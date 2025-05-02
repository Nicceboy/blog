import { PageLayout } from "../layouts/default.tsx";
import * as About from "~/posts/about.mdx";
import { MDXProvider } from "@mdx-js/react";
import Components from "~/typography.tsx";
import { Sidenotes } from "~/components/sidenote.tsx";

const AboutPage: React.FC = () => {
  return (
    <PageLayout>

      <div className="flex flex-row">
      <title>About this page</title>
      <section className="prose box-border">
        <MDXProvider components={Components}>
          <About.default components={Components} />
        </MDXProvider>
      </section>
      <Sidenotes />
      </div>
    </PageLayout>
  );
};

export default AboutPage;

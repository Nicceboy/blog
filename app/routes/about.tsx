import { PageLayout } from "../layouts/default.tsx";

const AboutPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="about-page">
        <h1>About Me</h1>

        <div className="about-content">
          <h1>
            Hello! Wondering what I am doing here...
          </h1>

          {/* Add more about content here */}
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutPage;

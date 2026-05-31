import { useEffect, useState } from "react";
import PageSection from "../components/PageSection";
import Loader from "../components/Loader";
import { fetchSection } from "../lib/api";

function AboutPage() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetchSection("about")
      .then(setAbout)
      .catch(() => setAbout({ about: "Unable to load about section." }));
  }, []);

  if (!about) {
    return <Loader text="Loading about..." />;
  }

  return (
    <PageSection title="About">
      <div className="card split">
        <p className="about-text">{about.about}</p>
        {about.imageSource ? (
          <img src={about.imageSource} alt="Profile" className="about-image" />
        ) : null}
      </div>
    </PageSection>
  );
}

export default AboutPage;

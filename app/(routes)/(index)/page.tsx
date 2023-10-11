import { HomeAbout } from "_components/HomeAbout";
import { HomeHero } from "_components/HomeHero";
import { HomeTechAndExperiences } from "_components/HomeTechAndExperiences";
import { HomeToolsAndProjects } from "_components/HomeToolsAndProjects";

const Page = () => {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeToolsAndProjects />
      <HomeTechAndExperiences />
    </>
  );
};

export default Page;

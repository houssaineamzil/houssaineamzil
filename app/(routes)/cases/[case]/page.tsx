import { CaseDetails } from "_components/CaseDetails";
import { CaseHero } from "_components/CaseHero";
import { CaseImages } from "_components/CaseImages";
import { CaseRelated } from "_components/CaseRelated";
import { getProject } from "_utils/getProject";
import type { ProjectTypes } from "_utils/types";
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { case: string };
}): Promise<Metadata> => {
  // read route params
  const title = params.case.charAt(0).toUpperCase() + params.case.slice(1);

  return {
    title: title,
  };
};

const Page = async ({ params }: { params: { case: string } }) => {
  const projectData: ProjectTypes = await getProject(params.case);

  return (
    <>
      <CaseHero description={projectData.description_short} />
      <CaseDetails
        details={{
          info: projectData.info,
          description_full: projectData.description_full,
          technologies: projectData?.technologies,
          live_preview: projectData?.live_preview,
        }}
      />
      <CaseImages images={projectData.images} />
      <CaseRelated related={projectData.related} />
    </>
  );
};

export default Page;

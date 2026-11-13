import type { NextPage } from "next";
import { WorksGrid } from "@/components/worksGrid";
import { getCollection } from "@/services/projects";

const Page: NextPage = async () => (
  <WorksGrid projects={await getCollection("works").getAll()} />
);

export default Page;

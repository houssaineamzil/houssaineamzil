import { Dashboard } from "@/app/admin/dashboard";
import { getProjects } from "@/services/projects";

const Page = async () => {
  const projects = await getProjects();
  return (
    <Dashboard
      initialProjects={
        projects as ((typeof projects)[number] & { id: string })[]
      }
    />
  );
};

export default Page;

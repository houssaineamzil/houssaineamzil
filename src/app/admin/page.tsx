import { Dashboard } from "@/app/admin/dashboard";
import { getProjects } from "@/services/projects";

// Without this, the dashboard prerenders statically at build time and
// mutations that don't explicitly revalidatePath("/admin") (project
// save/delete/reorder only revalidate the public routes) would never be
// reflected here in production.
export const dynamic = "force-dynamic";

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

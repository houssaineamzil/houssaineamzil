import { Dashboard } from "@/app/admin/dashboard";
import { experimentsCollection } from "@/services/projects";

// Same reasoning as /admin: the list must reflect saves immediately, not a
// build-time snapshot.
export const dynamic = "force-dynamic";

const Page = async () => {
  const experiments = await experimentsCollection.getAll();
  return (
    <Dashboard
      kind="experiments"
      initialProjects={
        experiments as ((typeof experiments)[number] & { id: string })[]
      }
    />
  );
};

export default Page;

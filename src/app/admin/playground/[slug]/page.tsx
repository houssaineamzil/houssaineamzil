import { EditProjectPage } from "@/app/admin/projectPages";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => (
  <EditProjectPage kind="experiments" slug={(await params).slug} />
);

export default Page;

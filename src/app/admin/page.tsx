import { ProjectListPage } from "@/app/admin/projectPages";

// Admin pages read the DB on every request; without this they would
// prerender at build time and show a stale snapshot.
export const dynamic = "force-dynamic";

export default () => <ProjectListPage kind="works" />;

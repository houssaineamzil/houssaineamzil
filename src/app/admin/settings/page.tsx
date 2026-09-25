import { SettingsEditor } from "@/app/admin/settings/settingsEditor";
import { getSiteLinks } from "@/services/settings";

// saveSiteLinks revalidates "/" with type "layout", which does cover this
// route (it's nested under the root layout) — force-dynamic here is
// defense in depth, not relied on to fix a specific staleness bug.
export const dynamic = "force-dynamic";

const Page = async () => {
  const links = await getSiteLinks();
  return <SettingsEditor initial={links} />;
};

export default Page;

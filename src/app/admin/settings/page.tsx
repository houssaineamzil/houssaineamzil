import { SettingsEditor } from "@/app/admin/settings/settingsEditor";
import { getSiteLinks } from "@/services/settings";

const Page = async () => {
  const links = await getSiteLinks();
  return <SettingsEditor initial={links} />;
};

export default Page;

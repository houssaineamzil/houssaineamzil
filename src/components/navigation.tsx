import { NavigationView } from "@/components/navigationView";
import { getSiteLinks } from "@/services/settings";

export const Navigation: React.FC = async () => {
  const links = await getSiteLinks();
  return <NavigationView links={links} />;
};

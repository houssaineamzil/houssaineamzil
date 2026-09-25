import { AboutEditor } from "@/app/admin/about/aboutEditor";
import { getAboutContent } from "@/services/settings";

// Without this, the editor prerenders statically at build time and would
// load its initial draft from stale, build-time content in production —
// saveAbout's revalidatePath("/about") refreshes the public page but not
// this one, so re-opening the editor after a save would show the old copy
// and a further save would quietly revert the earlier change.
export const dynamic = "force-dynamic";

const Page = async () => {
  const about = await getAboutContent();
  return <AboutEditor initial={about} />;
};

export default Page;

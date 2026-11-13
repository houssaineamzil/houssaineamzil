// The site keeps two separate lists of projects: real work and experiments
// (the playground). This is the one place that says how each is routed and
// labelled, so pages, the admin and the editor never hard-code it.
export type CollectionKind = "works" | "experiments";

interface CollectionConfig {
  /** Public list page; entries live at `${publicPath}/${slug}`. */
  publicPath: string;
  /** Admin section; entries are edited at `${adminPath}/${slug}`. */
  adminPath: string;
  /** Admin list page. */
  adminListPath: string;
  title: string;
  /** One entry, as in "Add project". */
  singular: string;
  /** Link back to the list from a project page. */
  backLabel: string;
}

export const collections: Record<CollectionKind, CollectionConfig> = {
  works: {
    publicPath: "/works",
    adminPath: "/admin/projects",
    adminListPath: "/admin",
    title: "Projects",
    singular: "project",
    backLabel: "All projects",
  },
  experiments: {
    publicPath: "/playground",
    adminPath: "/admin/experiments",
    adminListPath: "/admin/experiments",
    title: "Experiments",
    singular: "experiment",
    backLabel: "Playground",
  },
};

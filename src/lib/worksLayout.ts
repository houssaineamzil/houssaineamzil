interface LayoutInput {
  slug: string;
  horizontal?: boolean;
}

interface LayoutEntry {
  slug: string;
  column: 1 | 2;
}

/**
 * Mirrors the old hand-curated `rows` array in works/page.tsx, but driven by
 * array order (so drag-reordering in the editor works) instead of a fixed
 * index lookup. A `horizontal` project always takes its own full-width row;
 * regular projects alternate two-per-row between columns 1 and 2, and an odd
 * one out at the end gets a single-item row.
 */
export function assignWorksLayout(projects: LayoutInput[]): LayoutEntry[][] {
  const rows: LayoutEntry[][] = [];
  let pendingLeft: LayoutInput | null = null;

  const flushPending = () => {
    if (pendingLeft) {
      rows.push([{ slug: pendingLeft.slug, column: 1 }]);
      pendingLeft = null;
    }
  };

  for (const project of projects) {
    if (project.horizontal) {
      flushPending();
      rows.push([{ slug: project.slug, column: 1 }]);
      continue;
    }

    if (pendingLeft) {
      rows.push([
        { slug: pendingLeft.slug, column: 1 },
        { slug: project.slug, column: 2 },
      ]);
      pendingLeft = null;
    } else {
      pendingLeft = project;
    }
  }

  flushPending();

  return rows;
}

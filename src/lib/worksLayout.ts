export type WorksColumn = 1 | 2 | 3 | 4;

interface LayoutInput {
  slug: string;
  horizontal?: boolean;
}

export interface LayoutEntry {
  slug: string;
  column: WorksColumn;
  /** How many of the four columns the card spans (a horizontal project takes 2). */
  span: 1 | 2;
}

/**
 * The staggered rhythm of the projects grid on desktop: each row places one or
 * two square cards on a four-column grid, then the pattern repeats. Driven by
 * array order, so reordering in the admin reshuffles the layout naturally.
 * A `horizontal` project always takes its own row, two columns wide and
 * centred. On mobile every card is simply one full-width row (see the page).
 */
const PATTERN: WorksColumn[][] = [[3, 4], [1, 4], [3], [1]];

export function assignWorksLayout(projects: LayoutInput[]): LayoutEntry[][] {
  const rows: LayoutEntry[][] = [];
  let patternIndex = 0;
  let pending: LayoutInput[] = [];

  const takeRow = (): WorksColumn[] => {
    const row = PATTERN[patternIndex % PATTERN.length] as WorksColumn[];
    patternIndex += 1;
    return row;
  };

  const fillRow = (items: LayoutInput[]) => {
    const columns = takeRow();
    rows.push(
      items.map((item, i) => ({
        slug: item.slug,
        column: columns[i] as WorksColumn,
        span: 1,
      })),
    );
  };

  // A row wants as many cards as its pattern has columns; if only some are
  // pending when a horizontal project (or the end) arrives, the row is
  // flushed with fewer cards and keeps the leading columns of its pattern.
  const flush = () => {
    if (pending.length > 0) {
      fillRow(pending);
      pending = [];
    }
  };

  for (const project of projects) {
    if (project.horizontal) {
      flush();
      rows.push([{ slug: project.slug, column: 2, span: 2 }]);
      continue;
    }

    pending.push(project);
    const wanted = (PATTERN[patternIndex % PATTERN.length] as WorksColumn[])
      .length;
    if (pending.length === wanted) {
      fillRow(pending);
      pending = [];
    }
  }

  flush();
  return rows;
}

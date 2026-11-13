export type WorksColumn = 1 | 2 | 3 | 4;

export interface LayoutEntry<T> {
  item: T;
  /** Position of the item in the input list. */
  index: number;
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

const isHorizontal = (item: object) =>
  "horizontal" in item && item.horizontal === true;

export function assignWorksLayout<T extends object>(
  items: T[],
): LayoutEntry<T>[][] {
  const rows: LayoutEntry<T>[][] = [];
  let patternIndex = 0;
  let pending: { item: T; index: number }[] = [];

  const patternRow = () =>
    PATTERN[patternIndex % PATTERN.length] as WorksColumn[];

  const fillRow = () => {
    const columns = patternRow();
    patternIndex += 1;
    rows.push(
      pending.map((entry, i) => ({
        ...entry,
        column: columns[i] as WorksColumn,
        span: 1,
      })),
    );
    pending = [];
  };

  // A row wants as many cards as its pattern has columns; if only some are
  // pending when a horizontal project (or the end) arrives, the row is
  // flushed with fewer cards and keeps the leading columns of its pattern.
  const flush = () => {
    if (pending.length > 0) fillRow();
  };

  for (const [index, item] of items.entries()) {
    if (isHorizontal(item)) {
      flush();
      rows.push([{ item, index, column: 2, span: 2 }]);
      continue;
    }

    pending.push({ item, index });
    if (pending.length === patternRow().length) fillRow();
  }

  flush();
  return rows;
}

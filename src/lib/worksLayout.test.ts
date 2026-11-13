import { describe, expect, it } from "vitest";
import { assignWorksLayout } from "./worksLayout";

const slugs = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ slug: `p${i}` }));

// The layout of the items, without the items themselves.
const shape = (rows: ReturnType<typeof assignWorksLayout<{ slug: string }>>) =>
  rows.map((row) =>
    row.map((e) => ({ slug: e.item.slug, column: e.column, span: e.span })),
  );

describe("assignWorksLayout", () => {
  it("follows the staggered four-column pattern and repeats it", () => {
    const rows = assignWorksLayout(slugs(9));
    expect(rows.map((row) => row.map((e) => e.column))).toEqual([
      [3, 4],
      [1, 4],
      [3],
      [1],
      [3, 4],
      [1],
    ]);
    expect(rows.flat().map((e) => e.item.slug)).toEqual(
      slugs(9).map((p) => p.slug),
    );
  });

  it("keeps the leading column of a partly filled final row", () => {
    const rows = assignWorksLayout(slugs(5));
    expect(shape(rows).at(-1)).toEqual([{ slug: "p4", column: 3, span: 1 }]);
  });

  it("gives a horizontal project its own centred two-column row", () => {
    const rows = assignWorksLayout([
      { slug: "a" },
      { slug: "wide", horizontal: true },
      { slug: "b" },
    ]);
    expect(shape(rows)).toEqual([
      [{ slug: "a", column: 3, span: 1 }],
      [{ slug: "wide", column: 2, span: 2 }],
      [{ slug: "b", column: 1, span: 1 }],
    ]);
  });

  it("returns an empty array for no projects", () => {
    expect(assignWorksLayout([])).toEqual([]);
  });
});

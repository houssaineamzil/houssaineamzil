import { describe, expect, it } from "vitest";
import { assignWorksLayout } from "./worksLayout";

describe("assignWorksLayout", () => {
  it("alternates two projects per row into columns 1 and 2", () => {
    const projects = [{ slug: "a" }, { slug: "b" }, { slug: "c" }, { slug: "d" }];
    const rows = assignWorksLayout(projects);
    expect(rows).toEqual([
      [
        { slug: "a", column: 1 },
        { slug: "b", column: 2 },
      ],
      [
        { slug: "c", column: 1 },
        { slug: "d", column: 2 },
      ],
    ]);
  });

  it("gives a horizontal project its own full row", () => {
    const projects = [
      { slug: "a" },
      { slug: "wide", horizontal: true },
      { slug: "b" },
    ];
    const rows = assignWorksLayout(projects);
    expect(rows).toEqual([
      [{ slug: "a", column: 1 }],
      [{ slug: "wide", column: 1 }],
      [{ slug: "b", column: 1 }],
    ]);
  });

  it("returns an empty array for no projects", () => {
    expect(assignWorksLayout([])).toEqual([]);
  });
});

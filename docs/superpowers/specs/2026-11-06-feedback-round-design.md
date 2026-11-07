# Portfolio feedback round — design

Source: Sebastian's mobile review of v3, plus the owner's decisions on each point.

## Intent

Make the site calmer and clearer on mobile, make the projects page feel like the
reference (staggered grid of square images), and make the project pages read as
outcome-focused case studies. Visitors should see pictures sooner and always
know how to move between projects.

## Goals

1. **Projects page (`/works`)**
   - Desktop: staggered **four-column** grid of square images. Each card shows
     index (001), name, and the first two labels underneath. Cards sit at
     varying columns per row (as in the reference screenshots), driven by
     project order so admin reordering still works.
   - Mobile / small tablet: one full-width image per row, caption below.
   - No grayscale/pixelate treatment. No zoom at rest. On hover (pointer
     devices only) the hovered card's image gets a **fine** zoom-in.
2. **Homepage (`/`)**
   - Desktop (large screens): keep the horizontal slider, including the tick sound.
   - Mobile and small tablets: no horizontal slider; a normal vertical scroll
     list of projects, no click sound. (Sound is removed on mobile by there
     being no slider there.)
3. **Motion**
   - Remove the permanent `scale-110` zoom from `Image`.
   - Parallax stays on desktop but is reduced (~±5%); on mobile it is reduced
     further or off. The slider's loading poster and the hover state must use
     the same scale so there is no visible jump.
4. **Nav:** progressive blur beneath the fixed nav so links stay tappable and
   readable over images.
5. **Project page**
   - Remove all-caps copy (sentence case) in the project page.
   - Reduce the space above the content so images show sooner.
   - Replace the emailed CTA with copy like "Let's collaborate" linking to
     `mailto:`.
   - Add **Prev** alongside Next, plus a link back to the overview.
   - Hovering Prev/Next shows a dark tooltip that follows the cursor,
     containing the target project's name (and thumbnail).
6. **Result chips:** small chip on each project image (e.g. "+30% conversion").
   Desktop: visible on hover. Mobile: always visible. Shown on the projects
   page (and slider cards if trivially shared). Backed by a new optional
   `result` text field on projects, editable in the admin editor. Empty = no
   chip.
7. **Accessibility pass** across the whole site, with the first fix being
   greyed-out label contrast (`text-muted` too light). Target WCAG AA
   contrast; also check focus states, tap target size, alt text, reduced
   motion, heading order. Run an automated audit (e.g. axe/Lighthouse) and
   fix what it finds.

## Non-goals

- Rewriting project descriptions (deferred by the owner).
- Writing real result numbers: chips ship empty until the owner fills them in.
- Barcode/logo redesign (deferred).
- Any change to admin beyond the new `result` field.

## Anti-goals

- No regressions to slider behaviour on desktop.
- Nothing that makes mobile heavier (no extra scroll listeners there).

## Constraints

- Next.js 16 with breaking changes: read the relevant guide in
  `node_modules/next/dist/docs/` before writing code (per AGENTS.md).
- DB schema change needs a Drizzle migration (`bun run db:generate`);
  `bun dev` applies migrations automatically.
- Breakpoint for "desktop slider vs mobile list": my call, `lg` (1024px), so
  small tablets get the list.

## Left to the builder

- Exact grid column placement algorithm (replace `assignWorksLayout`'s
  two-column logic with a four-column staggering that reads like the reference).
- Blur implementation (stacked backdrop-filter layers with a mask gradient).
- Cursor tooltip implementation (small client component, hidden on touch).
- Which audit tool to use and how to fix findings.

## My calls (not yet confirmed by the owner)

- `lg` breakpoint for slider vs list.
- Chips are a single free-text `result` field per project.
- Tooltip shows name + thumbnail.
- Homepage mobile list reuses the projects-page card component.

import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { DEFAULT_CONTENT, encodeAssets, mergeContent, parseContent } from "@/lib/site-content";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});

describe("Saved site content", () => {
  it("falls back to the shipped copy when nothing is saved", () => {
    expect(mergeContent(null).hero.badge).toBe("Patient No. 17 · Basement ward · 1961");
    expect(mergeContent(null).mimic.title).toBe("THE MIMIC");
  });

  it("lets a saved section override only the fields it changes", () => {
    const merged = mergeContent({ hero: { badge: "Patient No. 17 · Ward B · 1962" } });

    expect(merged.hero.badge).toBe("Patient No. 17 · Ward B · 1962");
    expect(merged.hero.playUrl).toBe(DEFAULT_CONTENT.hero.playUrl);
    expect(merged.hero.subtitle).toBe(DEFAULT_CONTENT.hero.subtitle);
    expect(merged.mimic.title).toBe("THE MIMIC");
  });

  it("replaces a saved list wholesale instead of merging it item by item", () => {
    const merged = mergeContent({
      pillars: [{ title: "Sneak", text: "Learn its patrol." }],
    });

    expect(merged.pillars).toHaveLength(1);
    expect(merged.pillars[0]?.title).toBe("Sneak");
  });

  it("ignores a section the save does not mention", () => {
    const merged = mergeContent({ asylum: { title: "THE WARD" } });

    expect(merged.asylum.title).toBe("THE WARD");
    expect(merged.asylum.rooms).toHaveLength(8);
    expect(merged.asylum.rooms[7]?.name).toBe("Isolation cells");
  });

  it("keeps the page on shipped copy when the saved JSON is broken", () => {
    expect(parseContent('{"hero": {"badge": "x"')).toBe(DEFAULT_CONTENT);
    expect(parseContent(null).footer.name).toBe("THE MIMIC");
    expect(parseContent('{"hero":{"badge":"Patient No. 18"}}').hero.badge).toBe(
      "Patient No. 18",
    );
  });
});

describe("Admin edits", () => {
  it("keeps bundled pictures working after a save round-trip", () => {
    const saved = JSON.parse(JSON.stringify(encodeAssets(DEFAULT_CONTENT)));
    expect(saved.images.heroBackground).toBe("asset:hero-hallway");
    expect(mergeContent(saved).images.heroBackground).toBe(DEFAULT_CONTENT.images.heroBackground);
  });
  it("shows a released chapter and added developers from a save", () => {
    const merged = mergeContent({ chapters: [{ ...DEFAULT_CONTENT.chapters[1], released: true }], developers: [] });
    expect(merged.chapters[0]?.released).toBe(true);
    expect(merged.developers).toHaveLength(0);
  });
});

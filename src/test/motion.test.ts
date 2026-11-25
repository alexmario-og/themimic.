import { describe, expect, it } from "vitest";
import { SCARE_DURATION_MS, shouldPlayIntro } from "@/lib/motion";

describe("Opening scare", () => {
  it("lasts exactly 0.3 seconds", () => {
    expect(SCARE_DURATION_MS).toBe(300);
  });
  it("skips the scare for reduced motion", () => {
    expect(shouldPlayIntro(true, false, false)).toBe(false);
    expect(shouldPlayIntro(false, false, false)).toBe(true);
  });
  it("does not replay within a tab session", () => {
    expect(shouldPlayIntro(false, true, false)).toBe(false);
  });
  it("does not interrupt a direct section link", () => {
    expect(shouldPlayIntro(false, false, true)).toBe(false);
  });
});
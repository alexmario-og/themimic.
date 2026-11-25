import logo from "@/assets/silent-logo.jpg.asset.json";
import hallway from "@/assets/hero-hallway.jpg";
import ward from "@/assets/location-ward.jpg";
import entity from "@/assets/mimic-entity.jpg";
import { DEVELOPERS, type Developer } from "@/lib/developers";

export type Chapter = { number: string; label: string; title: string; image: string; released: boolean; rooms: { name: string; sub: string }[] };
export type ExtraSection = { kicker: string; title: string; text: string; image: string; buttonLabel: string; buttonUrl: string };

export type Link = { label: string; desc: string; url: string };
export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export type SiteContent = {
  brand: { name: string; studio: string; logo: string; footerText: string; copyright: string };
  nav: NavItem[];
  socials: { label: string; url: string }[];
  hero: {
    badge: string;
    titleLines: string[];
    subtitle: string;
    playLabel: string;
    playUrl: string;
    secondaryLines: string[];
    quote: string;
  };
  pillars: { title: string; text: string }[];
  mimic: {
    kicker: string;
    title: string;
    intro: string;
    traits: { key: string; value: string }[];
  };
  gameplay: { kicker: string; title: string; steps: string[] };
  asylum: {
    kicker: string;
    title: string;
    blurb: string;
    rooms: { name: string; sub: string }[];
  };
  development: {
    kicker: string;
    title: string;
    text: string;
    primaryLabel: string;
    primaryUrl: string;
    secondaryLabel: string;
    secondaryUrl: string;
    stats: { key: string; value: string }[];
  };
  footer: { name: string; line: string };
  images: { heroBackground: string; pillarImage1: string; pillarImage2: string; mimicImage: string; chaptersBackground: string; teamBackground: string };
  team: { kicker: string; title: string; text: string };
  developers: Developer[];
  chapters: Chapter[];
  sections: ExtraSection[];
};

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "THE MIMIC",
    studio: "Silent Interactive Studios",
    logo: logo.url,
    footerText: "It is not trying to escape anymore. It is already here.",
    copyright: "© 2026 Silent Interactive Studios",
  },
  nav: [
    { label: "Home", href: "#top" },
    { label: "Content Creator Portal", href: "#" },
    { label: "Roadmap", href: "#dev" },
    { label: "Development & Staff Team", href: "#team" },
    {
      label: "Support Us",
      href: "#",
      children: [
        { label: "Discord", href: "https://discord.com/invite/ezgg" },
        { label: "Donated Packages", href: "#" },
        { label: "Avatar Links", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
  ],
  socials: [
    { label: "Discord", url: "https://discord.com/invite/ezgg" },
    { label: "YouTube", url: "#" },
    { label: "X", url: "#" },
    { label: "Roblox", url: "#" },
  ],
  hero: {
    badge: "Patient No. 17 · Basement ward · 1961",
    titleLines: ["THE", "MIMIC"],
    subtitle:
      "A multiplayer supernatural survival horror game. Nobody is who they seem.",
    playLabel: "Play on Roblox",
    playUrl: "https://www.roblox.com",
    secondaryLines: ["Meet the", "developers"],
    quote: "“Do not answer if it calls you by name.”",
  },
  pillars: [
    { title: "Hide", text: "Lockers, under beds, dark corners." },
    { title: "Deceive", text: "It wears the face of your friend." },
    { title: "Escape", text: "Restore power. Find the keys. Get out." },
  ],
  mimic: {
    kicker: "Patient record · Cell 6",
    title: "THE MIMIC",
    intro:
      "Admitted 14 September 1961. Name unknown. It copies the voices of staff perfectly. It does not eat. It does not sleep. At first it copied voices. Then it copied the people who spoke them.",
    traits: [
      {
        key: "True form",
        value:
          "Pale, elongated humanoid. Distorted proportions, hunched posture, long limbs, claw-like hands.",
      },
      {
        key: "Movement",
        value:
          "Tilted head, neck twitching, uneven walking — imitating human anatomy without understanding it.",
      },
      {
        key: "Disguise",
        value:
          "An ordinary player avatar, or a copied survivor. The tell is subtle: a head turn, a delay, too much stillness.",
      },
      {
        key: "Reveal",
        value:
          "A dedicated transformation when the moment is right. Then the hunt begins.",
      },
    ],
  },
  gameplay: {
    kicker: "One match · five stages",
    title: "HOW A NIGHT GOES",
    steps: [
      "Players enter the asylum. Roles are handed out in secret.",
      "Survivors explore, collect items and unlock restricted wings.",
      "The Mimic watches, disguises itself and picks its moment.",
      "Players disappear. The lights fail. The building turns on you.",
      "Escape — before it becomes you.",
    ],
  },
  asylum: {
    kicker: "The map · one building, many paths",
    title: "THE ASYLUM",
    blurb:
      "Cold corridors, red emergency light and rooms left half open. One memorable map built for hiding, lying and running.",
    rooms: [
      { name: "Main entrance", sub: "Reception · Ground floor" },
      { name: "Dorm B", sub: "Eight beds · always one more" },
      { name: "Treatment room", sub: "Top floor · session forty-one" },
      { name: "Pharmacy", sub: "Nine doses missing" },
      { name: "Morgue", sub: "Body record M-09" },
      { name: "Boiler room", sub: "Voices in the pipes" },
      { name: "Service tunnels", sub: "Something follows" },
      { name: "Isolation cells", sub: "Cell 6 is empty" },
    ],
  },
  development: {
    kicker: "Project status · early development",
    title: "STILL AWAKE",
    text:
      "We are in concept and early asset development. Direction, animation and map building are underway — and we are recruiting a scripter.",
    primaryLabel: "Join the Discord",
    primaryUrl: "https://discord.com/invite/ezgg",
    secondaryLabel: "Apply as scripter",
    secondaryUrl: "#",
    stats: [
      { key: "Platform", value: "Roblox" },
      { key: "Genre", value: "Social-deception horror" },
      { key: "First prototype", value: "One map · one Mimic" },
      { key: "Team", value: "Direction · Animation · Maps" },
    ],
  },
  footer: {
    name: "THE MIMIC",
    line: "It is not trying to escape anymore. It is already here.",
  },
  images: { heroBackground: hallway, pillarImage1: hallway, pillarImage2: ward, mimicImage: entity, chaptersBackground: ward, teamBackground: hallway },
  team: { kicker: "Silent Interactive Studios · The team", title: "DEVELOPERS", text: "The people keeping the lights flickering." },
  developers: DEVELOPERS,
  chapters: [],
  sections: [],
};
DEFAULT_CONTENT.chapters = [
  { number: "I", label: "Chapter 01", title: "Asylum", image: ward, released: true, rooms: DEFAULT_CONTENT.asylum.rooms },
  { number: "II", label: "Chapter 02", title: "Coming soon", image: hallway, released: false, rooms: [] },
  { number: "III", label: "Chapter 03", title: "Coming soon", image: hallway, released: false, rooms: [] },
];

/** Bundled pictures have build-specific URLs, so saves store a stable name instead. */
const ASSETS: Record<string, string> = { "hero-hallway": hallway, "location-ward": ward, "mimic-entity": entity };
function mapStrings(v: unknown, f: (s: string) => string): unknown {
  if (typeof v === "string") return f(v);
  if (Array.isArray(v)) return v.map((x) => mapStrings(x, f));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapStrings(x, f)]));
  return v;
}
export function encodeAssets<T>(v: T): T {
  return mapStrings(v, (s) => {
    for (const [name, url] of Object.entries(ASSETS)) if (s === url || new RegExp(`assets/${name}[.-]`).test(s)) return `asset:${name}`;
    return s;
  }) as T;
}
export function decodeAssets<T>(v: T): T {
  return mapStrings(encodeAssets(v), (s) => (s.startsWith("asset:") ? ASSETS[s.slice(6)] ?? s : s)) as T;
}

/** Saved content wins section by section; anything missing falls back to defaults. */
export function mergeContent(saved: unknown): SiteContent {
  if (!saved || typeof saved !== "object") return DEFAULT_CONTENT;
  const s = decodeAssets(saved) as Record<string, unknown>;
  const out: Record<string, unknown> = { ...DEFAULT_CONTENT };
  for (const k of Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[]) {
    const d = DEFAULT_CONTENT[k];
    const v = s[k];
    if (v == null) continue;
    if (Array.isArray(d)) {
      if (Array.isArray(v)) out[k] = v;
      continue;
    }
    if (typeof v === "object" && !Array.isArray(v)) out[k] = { ...(d as object), ...(v as object) };
  }
  return out as SiteContent;
}

/** A malformed save must never take the page down — fall back to defaults instead. */
export function parseContent(json: string | null): SiteContent {
  if (!json) return DEFAULT_CONTENT;
  try {
    return mergeContent(JSON.parse(json));
  } catch {
    return DEFAULT_CONTENT;
  }
}

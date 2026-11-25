export type Developer = {
  name: string;
  role: string;
  robloxUserId: number;
  /** Optional custom picture; when empty the Roblox avatar is used. */
  avatarUrl: string;
  bio: string;
  worksOn: string[];
  since: string;
  experience: string;
  tools: string[];
  highlights: { title: string; detail: string }[];
  quote: string;
  links: { label: string; url: string }[];
};

/** Stand-in team until the real names, Roblox accounts and links are supplied. */
export const DEVELOPERS: Developer[] = [
  {
    name: "Vesper",
    role: "Director · Lead designer",
    robloxUserId: 156,
    avatarUrl: "",
    bio: "Wrote the first draft of THE MIMIC on a napkin at 3am. Decides how long the lights stay off.",
    worksOn: ["Game design", "Story", "Sound"],
    since: "2024",
    experience: "4 years creating narrative horror",
    tools: ["Roblox Studio", "Figma", "Audacity"],
    highlights: [
      { title: "Patient 17", detail: "Created the entity's origin, survivor dialogue and branching case files." },
      { title: "The first night", detail: "Designed the hidden-role loop, escape objectives and sound-led scares." },
    ],
    quote: "The scariest thing in the room should be the person you trust.",
    links: [
      { label: "Roblox", url: "https://www.roblox.com/users/156/profile" },
      { label: "YouTube", url: "https://www.youtube.com/" },
    ],
  },
  {
    name: "Hollow",
    role: "Animator · Creature motion",
    robloxUserId: 261,
    avatarUrl: "",
    bio: "Makes the Mimic move wrong — just slightly, so you notice too late.",
    worksOn: ["Animation", "Rigging", "Creature AI"],
    since: "2024",
    experience: "3 years in character animation",
    tools: ["Blender", "Moon Animator", "Roblox Studio"],
    highlights: [
      { title: "Almost human", detail: "Built the uneven walk cycles, head twitches and copied survivor idle poses." },
      { title: "The reveal", detail: "Choreographed the transformation from familiar face to elongated creature." },
    ],
    quote: "One wrong movement is worth a hundred jump scares.",
    links: [
      { label: "Roblox", url: "https://www.roblox.com/users/261/profile" },
      { label: "X", url: "https://x.com/" },
    ],
  },
  {
    name: "Ward",
    role: "Map builder · Environment art",
    robloxUserId: 1,
    avatarUrl: "",
    bio: "Built every hallway in the asylum, then broke them on purpose.",
    worksOn: ["Level design", "Lighting", "Props"],
    since: "2025",
    experience: "5 years building atmospheric worlds",
    tools: ["Roblox Studio", "Blender", "Substance Painter"],
    highlights: [
      { title: "Asylum, 1961", detail: "Built the dormitories, treatment wing and interconnected service tunnels." },
      { title: "Lights out", detail: "Created emergency lighting, distressed props and hiding places with a history." },
    ],
    quote: "Every locked door needs a reason. Every open one needs a warning.",
    links: [
      { label: "Roblox", url: "https://www.roblox.com/users/1/profile" },
      { label: "Discord", url: "https://discord.com/invite/ezgg" },
    ],
  },
];

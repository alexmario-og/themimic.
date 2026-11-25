import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/SitePage";
import { parseContent } from "@/lib/site-content";
import { siteContentQuery } from "@/lib/site-content.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE MIMIC — Supernatural Survival Horror on Roblox" },
      { name: "description", content: "One of you is not who they seem. THE MIMIC is a multiplayer social-deception horror game set in an asylum in 1961." },
      { property: "og:title", content: "THE MIMIC — Nobody is who they seem" },
      { property: "og:description", content: "A multiplayer supernatural survival horror game on Roblox by Silent Interactive Studios. Patient 17 is no longer in Cell 6." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    const { json } = await context.queryClient.ensureQueryData(siteContentQuery);
    return parseContent(json);
  },
  component: Index,
});

function Index() {
  const c = Route.useLoaderData();
  return <SitePage c={c} />;
}

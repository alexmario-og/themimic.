<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Header, footer and Discord button live in `src/components/SiteChrome.tsx` and are shared by every page — keeps pages consistent.
- Developer roster lives in `src/lib/developers.ts`; Roblox avatars are fetched server-side by user ID in `developers.functions.ts` — Roblox's thumbnail API isn't browser-CORS friendly.
- Shared CTA treatments use Button variants and glass surfaces use global semantic tokens — keeps horror visuals consistent and controls accessible.
- Opening cinematic and scroll reveals live in CinematicMotion; skip scares for reduced motion, repeat tab visits, and anchor arrivals — preserves accessible, uninterrupted navigation.
- Creature traits use a sticky scroll-driven stack in TraitCarousel, with a static reduced-motion fallback; chapter selection lives in Chapters with animated disclosure — keeps motion tied to page progress without arrow controls.
- CinematicMotion initializes Lenis after hydration and disables it for reduced motion; nested dialogs keep native scrolling — smooths wheel input without intercepting touch or profile scrolling.
- All page content (text, links, pictures, developers, chapters, extra sections) lives in the `SiteContent` object, rendered by `SitePage`; `/admin` edits it with a generic editor and the same `SitePage` as live preview — keeps every visible part editable without per-field admin code.
- Uploaded pictures go to the private `site-media` bucket and are served via `/api/public/media/*`; bundled pictures are saved as `asset:<name>` tokens — workspace blocks public buckets and bundled URLs differ per build.

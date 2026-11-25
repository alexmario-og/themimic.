import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, LogOut, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SitePage } from "@/components/SitePage";
import { Field, labelFor } from "@/components/ContentEditor";
import { DEFAULT_CONTENT, encodeAssets, mergeContent, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin panel — THE MIMIC" },
      { name: "description", content: "Edit every part of THE MIMIC website." },
      { property: "og:title", content: "Admin panel — THE MIMIC" },
      { property: "og:description", content: "Edit every part of THE MIMIC website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type State = "loading" | "signed-out" | "not-admin" | "admin";

function AdminPage() {
  const [state, setState] = useState<State>("loading");
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setState("signed-out");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin");
      setState(roles?.length ? "admin" : "not-admin");
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN" || e === "SIGNED_OUT") void check(); });
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {state === "loading" && <p className="p-10 text-muted-foreground">Loading…</p>}
      {state === "signed-out" && <SignIn />}
      {state === "not-admin" && (
        <div className="mx-auto max-w-md space-y-4 p-10 text-center">
          <h1 className="font-display text-4xl">No access</h1>
          <p className="text-muted-foreground">This account is not an admin.</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      )}
      {state === "admin" && <Editor />}
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account.");
  }
  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin` });
    if (r.error) toast.error(String(r.error.message ?? r.error));
  }
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-5 p-6">
      <h1 className="text-ruin font-display text-5xl">ADMIN</h1>
      <p className="text-sm text-muted-foreground">The first account created becomes the admin.</p>
      <Button type="button" onClick={google} className="h-11 gap-[10px] border border-[#8E918F] bg-[#131314] px-3 text-[#E3E3E3] hover:bg-[#131314]/90">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
        Continue with Google
      </Button>
      <form onSubmit={submit} className="space-y-3">
        <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="horror" disabled={busy} className="w-full">{mode === "in" ? "Sign in" : "Create account"}</Button>
      </form>
      <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "No account yet? Create one" : "Have an account? Sign in"}
      </button>
    </div>
  );
}

const SECTIONS = Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[];
const SECTION_NAMES: Partial<Record<keyof SiteContent, string>> = {
  brand: "Brand & logo", nav: "Menu links", socials: "Social links", hero: "Top of page", pillars: "Hide / Deceive / Escape",
  mimic: "The Mimic", gameplay: "How a night goes", asylum: "Chapters heading", chapters: "Chapters", team: "Team heading",
  developers: "Developers", development: "Status & Discord", images: "Background pictures", sections: "Extra sections", footer: "Footer",
};

function Editor() {
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<keyof SiteContent>("hero");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    void supabase.from("site_content").select("data").eq("id", "main").maybeSingle().then(({ data }) => setDraft(mergeContent(data?.data ?? null)));
  }, []);

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ id: "main", data: encodeAssets(draft) as never, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) { toast.error(`Could not save: ${error.message}`); return; }
    setDirty(false);
    toast.success("Saved — the live site is updated.");
  }

  if (!draft) return <p className="p-10 text-muted-foreground">Loading content…</p>;
  const update = (v: unknown) => { setDraft({ ...draft, [tab]: v } as SiteContent); setDirty(true); };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <h1 className="mr-auto font-display text-2xl">ADMIN PANEL</h1>
        <Button variant="outline" size="sm" onClick={() => setShowPreview((v) => !v)}><Eye /> {showPreview ? "Hide" : "Show"} preview</Button>
        <Button variant="outline" size="sm" asChild><Link to="/" target="_blank">Open site</Link></Button>
        <Button variant="outline" size="sm" onClick={() => { if (confirm("Reset this section to the original text?")) update(DEFAULT_CONTENT[tab]); }}><RotateCcw /> Reset section</Button>
        <Button size="sm" variant="horror" disabled={saving || !dirty} onClick={save}><Save /> {saving ? "Saving…" : dirty ? "Save & publish" : "Saved"}</Button>
        <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => supabase.auth.signOut()}><LogOut /></Button>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav className="w-44 shrink-0 overflow-y-auto border-r border-border p-2">
          {SECTIONS.map((k) => (
            <button key={k} type="button" onClick={() => setTab(k)} className={`block w-full rounded px-3 py-2 text-left text-sm ${tab === k ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"}`}>
              {SECTION_NAMES[k] ?? labelFor(k)}
            </button>
          ))}
        </nav>
        <div className={`min-h-0 overflow-y-auto p-4 ${showPreview ? "w-full max-w-md shrink-0 border-r border-border" : "flex-1"}`} data-lenis-prevent>
          <h2 className="mb-4 text-lg font-semibold">{SECTION_NAMES[tab] ?? labelFor(tab)}</h2>
          <Field key={tab} name={tab} value={draft[tab] as never} onChange={update} />
        </div>
        {showPreview && (
          <div className="hidden min-w-0 flex-1 overflow-y-auto md:block" data-lenis-prevent>
            <SitePage c={draft} preview />
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content";

export function DiscordIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.4 18.4 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.5C.6 9.1-.3 13.7.1 18.2a19.9 19.9 0 0 0 6 3l1.3-2a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.8-9.7-3.6-13.8ZM8 15.4c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.6 8 10.6s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
    </svg>
  );
}

export function DiscordButton({ url, label, big }: { url: string; label: string; big?: boolean }) {
  return (
    <Button asChild variant="community" className={`min-h-12 max-w-full whitespace-normal gap-3 font-cond font-semibold uppercase ${big ? "h-auto px-5 py-4 text-lg sm:px-7 sm:text-xl" : "h-auto px-4 py-3 text-lg sm:px-5"}`}><a href={url} target="_blank" rel="noreferrer">
      <DiscordIcon className={big ? "h-7 w-7" : "h-5 w-5"} />
      <span className="min-w-0">{label}</span><ArrowUpRight aria-hidden="true" />
    </a></Button>
  );
}

const ICONS: Record<string, string> = {
  youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z",
  x: "M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.9 2.3h7l4.8 6.4 5.5-6.4Zm-1.2 17.9h1.9L7.1 4.2H5.1L17 20.2Z",
  roblox: "M5.2 1 1 17.2 18.8 23 23 6.8 5.2 1Zm9.6 13.8-4.5-1.2 1.2-4.5 4.5 1.2-1.2 4.5Z",
  tiktok: "M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2V2h-3.4v13.7a2.9 2.9 0 1 1-2-2.7V9.5a6.3 6.3 0 1 0 5.4 6.2V8.8a8.2 8.2 0 0 0 3.8 1V6.7Z",
};

export function SocialIcon({ label, className = "h-5 w-5" }: { label: string; className?: string }) {
  const k = label.toLowerCase();
  if (k === "discord") return <DiscordIcon className={className} />;
  const d = ICONS[k];
  if (!d) return <span className="label">{label}</span>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor"><path d={d} /></svg>;
}

export function SocialLinks({ c, className = "" }: { c: SiteContent; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {c.socials.map((s) => (
        <Button key={s.label} asChild variant="glass" size="icon" className="h-10 w-10 text-muted-foreground hover:text-bone"><a href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
          <SocialIcon label={s.label} />
        </a></Button>
      ))}
    </div>
  );
}

function NavLink({ href, children, className, onClick }: { href: string; children: React.ReactNode; className: string; onClick?: () => void }) {
  if (href === "/developers") href = "#team";
  if (href === "#" || href === "") return <a href="#" className={className} onClick={onClick}>{children}</a>;
  if (href.startsWith("#")) return <Link to="/" hash={href.slice(1)} className={className} onClick={onClick}>{children}</Link>;
  return <a href={href} className={className} onClick={onClick}>{children}</a>;
}

const navClass = "font-cond text-lg font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-bone";

function NavItemDesktop({ n }: { n: SiteContent["nav"][number] }) {
  if (!n.children?.length) return <NavLink href={n.href} className={navClass}>{n.label}</NavLink>;
  return (
    <div className="group relative">
      <NavLink href={n.href} className={`${navClass} flex items-center gap-1.5`}>{n.label}<ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden="true" /></NavLink>
      <div className="invisible absolute left-1/2 top-full z-30 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="glass-panel flex flex-col gap-1 p-2">
          {n.children.map((ch) => (
            <NavLink key={ch.label} href={ch.href} className="rounded-sm px-3 py-2 font-cond text-base font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-bone/5 hover:text-bone">{ch.label}</NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ c }: { c: SiteContent }) {
  const [open, setOpen] = useState(false);
  const discord = c.socials.find((s) => s.label === "Discord")?.url ?? c.development.primaryUrl;
  return (
    <>
      <header className="relative z-20 mx-auto grid grid-cols-[minmax(0,1fr)_auto] max-w-[1400px] items-center gap-4 px-6 py-5 sm:flex sm:justify-between md:px-12">
        <Link to="/" className="min-w-0 truncate font-display text-3xl text-bone">{c.brand.name}</Link>
        <nav className="hidden gap-7 lg:flex">
          {c.nav.map((n) => <NavItemDesktop key={n.label} n={n} />)}
        </nav>
        <div className="hidden items-center gap-4 lg:flex"><SocialLinks c={{ ...c, socials: c.socials.filter((s) => s.label !== "Discord") }} /><DiscordButton url={discord} label="Join" /></div>
        <Button variant="glass" size="icon" aria-label={open ? "Close menu" : "Menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="h-11 w-11 shrink-0 lg:hidden">
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      {open && (
        <nav id="mobile-navigation" className="relative z-20 flex flex-col gap-3 border-y border-border bg-ash/90 px-6 py-5 backdrop-blur-xl lg:hidden">
          {c.nav.map((n) => (
            <div key={n.label} className="flex flex-col gap-2">
              <NavLink href={n.href} onClick={() => setOpen(false)} className="font-cond text-lg uppercase text-bone">{n.label}</NavLink>
              {n.children?.map((ch) => (
                <NavLink key={ch.label} href={ch.href} onClick={() => setOpen(false)} className="pl-4 font-cond text-base uppercase text-muted-foreground">{ch.label}</NavLink>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-4 pt-2"><DiscordButton url={discord} label="Join the Discord" /><SocialLinks c={c} /></div>
        </nav>
      )}
    </>
  );
}

export function SiteFooter({ c }: { c: SiteContent }) {
  return (
    <footer className="ruin border-t border-border bg-ash px-6 py-14 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-8 md:flex-row">
        <div className="text-center md:text-left">
          <span className="text-ruin font-display text-4xl">{c.footer.name}</span>
          <p className="label mt-1 text-muted-foreground">A {c.brand.studio} game</p>
        </div>
        <p className="font-type text-sm text-muted-foreground">{c.footer.line}</p>
        <SocialLinks c={c} />
      </div>
      <p className="mx-auto mt-10 max-w-[1400px] text-center text-xs text-muted-foreground">{c.brand.copyright}</p>
    </footer>
  );
}

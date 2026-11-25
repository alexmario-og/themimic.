import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hallway from "@/assets/hero-hallway.jpg";
import { DiscordButton, SocialIcon } from "@/components/SiteChrome";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Developer } from "@/lib/developers";
import { avatarsQuery } from "@/lib/developers.functions";
import type { SiteContent } from "@/lib/site-content";

export function DevelopersSection({ c }: { c: SiteContent }) {
  const devs = c.developers;
  const { data: roblox = {} } = useQuery(avatarsQuery(devs.map((d) => Number(d.robloxUserId))));
  const pic = (d: Developer) => d.avatarUrl || roblox[String(d.robloxUserId)];
  const [open, setOpen] = useState<Developer | null>(null);
  return (
    <section id="team" className="ruin scroll-mt-10 overflow-hidden border-t border-border bg-ash">
      <img src={c.images.teamBackground} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-10 grayscale" />
      <div className="fog" aria-hidden="true" />
        <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-40 md:px-12">
          <p className="label text-muted-foreground">{c.team.kicker}</p>
          <h2 className="text-ruin mt-4 font-display text-6xl leading-none md:text-8xl">{c.team.title}</h2>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{c.team.text}</p>
        </div>
      <div className="px-6 md:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-3">
          {devs.map((d, i) => (
            <Button variant="ghost" key={`${i}-${d.name}`} type="button" aria-label={`View ${d.name}'s profile`} onClick={() => setOpen(d)} className="glass-panel team-card group transition-all duration-300">
              <img src={hallway} alt="" loading="lazy" className="panel-texture" />
              <Avatar img={pic(d)} name={d.name} />
              <span className="absolute left-5 top-5 font-display text-5xl text-bone/30">0{i + 1}</span>
              <div className="relative flex items-end justify-between gap-4 p-7">
                <div>
                  <h2 className="text-ruin font-display text-5xl">{d.name}</h2>
                  <p className="label mt-2 text-muted-foreground">{d.role}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-bone/60 transition-colors group-hover:text-bone"><ArrowUpRight aria-hidden="true" /></span>
              </div>
            </Button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-40 md:px-12">
        <div className="mx-auto mt-24 flex max-w-[1400px] flex-col items-center gap-6 text-center">
          <p className="font-cond text-2xl uppercase tracking-wide text-bone">Want to join the team?</p>
          <DiscordButton big url={c.development.primaryUrl} label={c.development.primaryLabel} />
        </div>
      </div>
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent data-lenis-prevent className="developer-profile max-w-4xl gap-0 overflow-y-auto p-0">
          {open && (
            <div className="grid md:grid-cols-[.8fr_1.2fr]">
              <div className="profile-sidebar border-b border-border md:border-b-0 md:border-r">
                <Avatar img={pic(open)} name={open.name} color compact />
                <div className="p-6">
                  
                  <p className="mt-4 font-cond text-xl text-bone">{open.experience}</p>
                  <p className="label mt-6 text-muted-foreground">Toolkit</p>
                  <p className="mt-2 text-sm leading-relaxed text-bone">{open.tools.join(" · ")}</p>
                  <blockquote className="mt-8 border-l-2 border-blood pl-4 font-type text-sm leading-relaxed text-muted-foreground">“{open.quote}”</blockquote>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-4 p-7">
                <DialogTitle className="text-ruin font-display text-5xl font-normal">{open.name}</DialogTitle>
                <p className="label text-muted-foreground">{open.role} · since {open.since}</p>
                <DialogDescription className="font-type text-base text-bone/80">{open.bio}</DialogDescription>
                <div className="flex flex-wrap gap-2">{open.worksOn.map((w) => <span key={w} className="border border-border px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">{w}</span>)}</div>
                <div className="mt-4 border-t border-border pt-5">
                  <h3 className="font-display text-2xl text-bone">Selected work</h3>
                  {open.highlights.map((work) => <div key={`${work.title}-${work.detail}`} className="mt-4">
                    <h4 className="font-cond text-lg font-semibold text-bone">{work.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{work.detail}</p>
                  </div>)}
                </div>
                
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {open.links.map((l) => (
                    <Button key={`${l.label}-${l.url}`} asChild variant="glass" className="font-cond uppercase"><a href={l.url} target="_blank" rel="noreferrer">
                      <SocialIcon label={l.label} className="h-4 w-4" />{l.label}
                    </a></Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Avatar({ img, name, color, compact }: { img?: string | undefined; name: string; color?: boolean; compact?: boolean }) {
  return (
    <div className={`avatar-surface relative aspect-square overflow-hidden ${compact ? "profile-avatar" : ""}`}>
      {img ? (
        <img src={img} alt={`${name}'s Roblox avatar`} loading="lazy" className={`h-full w-full object-contain transition duration-500 group-hover:scale-105 ${color ? "" : "grayscale group-hover:grayscale-0"}`} />
      ) : (
        <svg viewBox="0 0 100 100" aria-label={`${name} placeholder`} className="h-full w-full p-12 text-bone/15" fill="currentColor"><circle cx="50" cy="34" r="18" /><path d="M14 96c0-22 16-36 36-36s36 14 36 36Z" /></svg>
      )}
    </div>
  );
}

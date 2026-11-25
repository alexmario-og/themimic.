import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/lib/site-content";
import ward from "@/assets/location-ward.jpg";
import handprints from "@/assets/painted-handprints.png.asset.json";

export function Chapters({ chapters }: { chapters: Chapter[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex === null ? null : chapters[openIndex] ?? null;
  return <>
    <div className="mt-12 grid gap-4 sm:grid-cols-3">
      {chapters.map((ch, i) => ch.released ? (
        <Button key={i} variant="glass" className="chapter-card group" data-state={openIndex === i ? "open" : "closed"} aria-expanded={openIndex === i} aria-controls="chapter-rooms" onClick={() => setOpenIndex((v) => (v === i ? null : i))}>
          <img src={ch.image || ward} alt="" loading="lazy" className="chapter-image" />
          <span className="relative flex h-full w-full flex-col items-start justify-between p-6">
            <span className="label text-bone">{ch.label}</span>
            <span className="font-display text-8xl text-ruin">{ch.number}</span>
            <span className="flex w-full items-center justify-between gap-2 font-display text-3xl text-bone">{ch.title} {openIndex === i ? <ArrowDownRight /> : <ArrowUpRight />}</span>
          </span>
        </Button>
      ) : (
        <Button key={i} variant="glass" className="chapter-card chapter-sealed" disabled aria-label={`Chapter ${ch.number} — locked`}>
          <img src={ch.image || ward} alt="" loading="lazy" className="chapter-image" />
          <img src={handprints.url} alt="" className="chapter-blood" aria-hidden="true" />
          <span aria-hidden="true" className="relative flex h-full w-full flex-col items-start justify-between p-6">
            <span className="label text-muted-foreground">{ch.label}</span>
            <span className="font-display text-8xl text-blood blur-[2px]">{ch.number}</span>
            <span className="chapter-stamp">In development</span>
            <span className="flex w-full items-center justify-between font-cond text-lg uppercase text-bone">Not yet released <LockKeyhole /></span>
          </span>
        </Button>
      ))}
    </div>
    <div className="rooms-disclosure" data-state={open ? "open" : "closed"} aria-hidden={!open} inert={!open}>
    <div className="rooms-clip">
    {open && <div id="chapter-rooms" role="region" aria-label={`${open.title} rooms`} className="rooms-content mt-12 border-t border-border pt-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-display text-4xl text-bone">Chapter {open.number} · {open.title}</h3>
        <span className="label text-blood">Restricted floor plan</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {open.rooms.map((room, index) => <div key={index} className="room-card glass-panel group p-4 transition-all hover:border-blood md:p-6">
          <img src={open.image || ward} alt="" loading="lazy" className="panel-texture" />
          <span className="label text-muted-foreground">Floor plan · {String(index + 1).padStart(2, "0")}</span>
          <h4 className="relative mt-10 break-words font-display text-3xl text-bone group-hover:text-blood md:text-4xl">{room.name}</h4>
          <p className="mt-1 font-cond uppercase text-muted-foreground">{room.sub}</p>
        </div>)}
      </div>
    </div>}
    </div>
    </div>
  </>;
}

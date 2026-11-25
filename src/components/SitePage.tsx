import { ClientOnly, Link } from "@tanstack/react-router";
import { Fragment, lazy, Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import handprints from "@/assets/painted-handprints.png.asset.json";
import { DiscordButton, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { DevelopersSection } from "@/components/DevelopersSection";
import { FlashlightCursor } from "@/components/FlashlightCursor";
import { CinematicMotion } from "@/components/CinematicMotion";
import type { SiteContent } from "@/lib/site-content";
import { TraitCarousel } from "@/components/TraitCarousel";
import { Chapters } from "@/components/Chapters";

const MimicScene = lazy(() => import("@/components/MimicScene"));

function Lines({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={`${i}-${l}`}>
          {i > 0 && <br />}
          <span className={className}>{l}</span>
        </Fragment>
      ))}
    </>
  );
}

function Hero({ c, preview }: { c: SiteContent; preview?: boolean | undefined }) {
  return (
    <section id="top" className="ruin relative min-h-[100svh] overflow-hidden bg-ash">
      <img src={c.images.heroBackground} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale" />
      <div className="hero-shade absolute inset-0" />
      <div className="hero-monster absolute right-0 md:inset-y-0 md:w-[60%]">
        {!preview && <ClientOnly fallback={null}>
          <Suspense fallback={null}><MimicScene /></Suspense>
        </ClientOnly>}
      </div>
      <div className="fog" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ash to-transparent" />

      <SiteHeader c={c} />

      <div className="hero-content pointer-events-none relative z-10 mx-auto flex max-w-[1400px] flex-col justify-between gap-12 px-6 pb-12 md:px-12">
        <div className="pointer-events-auto mt-12 max-w-xl md:mt-20">
          <p className="label mb-3 text-bone/70">{c.brand.studio} presents</p>
          <p className="label mb-6 text-blood">{c.hero.badge}</p>
          <h1 className="hero-title text-ruin font-display leading-[0.8]"><Lines lines={c.hero.titleLines} /></h1>
          <p className="mt-8 max-w-sm font-cond text-xl uppercase tracking-wide text-muted-foreground">{c.hero.subtitle}</p>
          <div className="hero-actions mt-10">
            <Button asChild variant="horror" className="h-14 min-w-0 px-5 font-cond text-lg font-semibold uppercase"><a href={c.hero.playUrl} target="_blank" rel="noreferrer"><img src={handprints.url} alt="" aria-hidden="true" className="play-texture" /><span className="play-label min-w-0">{c.hero.playLabel}</span><ArrowUpRight aria-hidden="true" /></a></Button>
            <DiscordButton url={c.development.primaryUrl} label={c.development.primaryLabel} />
            <Button asChild variant="ghost" className="group h-12 gap-3 px-0 font-cond text-lg font-semibold uppercase text-bone hover:bg-transparent"><Link to="/" hash="team"><span>{c.hero.secondaryLines.join(" ")}</span><ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link></Button>
          </div>
        </div>
        <div className="flex items-center gap-5 self-end">
          <span className="hidden h-px w-40 bg-bone/60 md:block" />
          <p className="hero-warning font-cond text-xl font-semibold uppercase text-bone md:text-2xl">{c.hero.quote}</p>
        </div>
      </div>
    </section>
  );
}

function Pillars({ c }: { c: SiteContent }) {
  return (
    <section className="relative z-10 -mt-6 bg-ash px-6 md:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-3 md:grid-cols-3">
        {c.pillars.map((p, i) => (
          <div key={i} className="glass-panel group h-44">
            <img src={i % 2 ? c.images.pillarImage2 : c.images.pillarImage1} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-45" style={{ objectPosition: `${i * 40}% 50%` }} />
            <span className="absolute -bottom-6 right-2 font-display text-[7rem] leading-none text-bone/5">{p.title}</span>
            <div className="relative flex h-full flex-col justify-between p-6">
              <h3 className="text-ruin font-display text-5xl">{p.title}</h3>
              <p className="font-cond text-lg uppercase tracking-wide text-muted-foreground">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Heading({ kicker, title, id }: { kicker: string; title: string; id?: string }) {
  return (
    <div id={id} className="scroll-mt-10">
      <p className="label text-blood">{kicker}</p>
      <h2 className="text-ruin mt-4 font-display text-6xl leading-none md:text-8xl">{title}</h2>
    </div>
  );
}

function MimicFile({ c }: { c: SiteContent }) {
  return (
    <section className="mimic-section ruin bg-ash px-6 py-40 md:px-12">
      <img src={c.images.mimicImage} alt="" loading="lazy" className="absolute inset-y-0 left-0 -z-10 h-full w-1/2 object-cover opacity-15 grayscale [mask-image:linear-gradient(90deg,black,transparent)]" />
      <div className="mx-auto grid max-w-[1400px] gap-20 md:grid-cols-[1fr_1.2fr]">
        <div className="mimic-intro">
          <Heading id="mimic" kicker={c.mimic.kicker} title={c.mimic.title} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">{c.mimic.intro}</p>
        </div>
        <TraitCarousel traits={c.mimic.traits} />
      </div>
    </section>
  );
}


function Asylum({ c }: { c: SiteContent }) {
  return (
    <section className="ruin overflow-hidden border-t border-border bg-ash px-6 py-40 md:px-12">
      <img src={c.images.chaptersBackground} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-10 grayscale" />
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Heading id="asylum" kicker={c.asylum.kicker} title={c.asylum.title} />
          <p className="max-w-md text-lg text-muted-foreground">{c.asylum.blurb}</p>
        </div>
        <Chapters chapters={c.chapters} />
      </div>
    </section>
  );
}

function Development({ c }: { c: SiteContent }) {
  return (
    <section className="ruin border-t border-border bg-card px-6 py-40 md:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-20 md:grid-cols-2">
        <div>
          <Heading id="dev" kicker={c.development.kicker} title={c.development.title} />
          <p className="mt-8 max-w-md text-lg text-muted-foreground">{c.development.text}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <DiscordButton big url={c.development.primaryUrl} label={c.development.primaryLabel} />
            <Button asChild variant="glass" className="h-14 px-7 font-cond text-lg font-semibold uppercase"><a href={c.development.secondaryUrl}>{c.development.secondaryLabel}<ArrowUpRight aria-hidden="true" /></a></Button>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-start">
          {c.development.stats.map((s) => (
            <div key={`${s.key}-${s.value}`} className="glass-panel p-6 transition-colors hover:border-blood">
              <dt className="label text-muted-foreground">{s.key}</dt>
              <dd className="mt-2 font-display text-3xl text-bone">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ExtraSections({ c }: { c: SiteContent }) {
  return (
    <>
      {c.sections.map((s, i) => (
        <section key={i} className="ruin border-t border-border bg-ash px-6 py-32 md:px-12">
          {s.image && <img src={s.image} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-15 grayscale" />}
          <div className="mx-auto max-w-[1400px]">
            <Heading kicker={s.kicker} title={s.title} />
            <p className="mt-8 max-w-2xl whitespace-pre-line text-lg text-muted-foreground">{s.text}</p>
            {s.buttonLabel && s.buttonUrl && (
              <Button asChild variant="glass" className="mt-10 h-14 px-7 font-cond text-lg font-semibold uppercase"><a href={s.buttonUrl} target="_blank" rel="noreferrer">{s.buttonLabel}<ArrowUpRight aria-hidden="true" /></a></Button>
            )}
          </div>
        </section>
      ))}
    </>
  );
}

/** The whole public page; the admin panel renders the same thing with unsaved edits. */
export function SitePage({ c, preview }: { c: SiteContent; preview?: boolean | undefined }) {
  return (
    <main className="grain relative">
      <Hero c={c} preview={preview} />
      <Pillars c={c} />
      <MimicFile c={c} />
      <Asylum c={c} />
      <DevelopersSection c={c} />
      <Development c={c} />
      <ExtraSections c={c} />
      {!preview && <ClientOnly fallback={null}><FlashlightCursor /><CinematicMotion /></ClientOnly>}
      <SiteFooter c={c} />
    </main>
  );
}

import { useEffect, useRef } from "react";
import type { SiteContent } from "@/lib/site-content";
import entity from "@/assets/mimic-entity.jpg";

export function TraitCarousel({ traits }: { traits: SiteContent["mimic"]["traits"] }) {
  const stack = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = stack.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = root.querySelectorAll<HTMLElement>(".trait-card");
    const deck = root.querySelector<HTMLElement>(".trait-deck");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (preference.matches || !deck) return;
      const rect = root.getBoundingClientRect();
      const top = Math.max(24, Math.min(64, window.innerHeight * .1));
      const progress = Math.max(0, Math.min(traits.length - 1, (top - rect.top) / Math.max(1, rect.height - deck.offsetHeight) * (traits.length - 1)));
      root.dataset['activeTrait'] = String(Math.min(traits.length - 1, Math.round(progress)));
      cards.forEach((card, index) => {
        const distance = index - progress;
        const behind = Math.min(3, Math.max(0, distance));
        const leaving = Math.min(1, Math.max(0, -distance));
        card.style.setProperty("--card-y", `${behind * 15 - leaving * 450}px`);
        card.style.setProperty("--card-scale", String(1 - behind * .035));
        card.style.setProperty("--card-rotation", `${behind * -.65 - leaving * 7}deg`);
        card.style.setProperty("--card-opacity", String(Math.max(0, 1 - leaving * 1.5)));
        card.style.zIndex = String(traits.length - index);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [traits.length]);

  return <div ref={stack} className="trait-stack min-w-0" role="region" aria-label="Creature traits">
      <dl className="trait-deck">
        {traits.map((trait, index) => <div key={trait.key} className="trait-card glass-panel flex flex-col justify-end p-7" data-trait={trait.key}>
          <img src={entity} alt="" loading="lazy" className="trait-image absolute inset-0 h-full w-full object-cover" />
          <span className="label relative mb-auto flex items-center justify-between text-bone">Patient file · {String(index + 1).padStart(2, "0")}<span className="text-blood">{String(index + 1).padStart(2, "0")} / 04</span></span>
          <dt className="relative mt-16 font-display text-5xl text-bone">{trait.key}</dt>
          <dd className="relative mt-4 text-lg leading-relaxed text-muted-foreground">{trait.value}</dd>
        </div>)}
      </dl>
  </div>;
}
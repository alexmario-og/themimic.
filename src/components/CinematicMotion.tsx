import { useEffect, useState } from "react";
import scare from "@/assets/mimic-cinematic-closeup.png.asset.json";
import { INTRO_FADE_MS, SCARE_DURATION_MS, shouldPlayIntro } from "@/lib/motion";

/** Progressive motion: all content stays readable without JavaScript or animation. */
export function CinematicMotion() {
  const [phase, setPhase] = useState<"idle" | "scare" | "fade">("idle");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let version = 0;
    const configure = async () => {
      const current = ++version;
      dispose?.();
      dispose = undefined;
      if (preference.matches) return;
      const { default: Lenis } = await import("lenis");
      if (current !== version) return;
      const scrolling = new Lenis({ autoRaf: true, lerp: .085, smoothWheel: true, syncTouch: false, allowNestedScroll: true, anchors: true });
      dispose = () => scrolling.destroy();
    };
    void configure();
    preference.addEventListener("change", configure);
    return () => { version++; dispose?.(); preference.removeEventListener("change", configure); };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem("mimic-intro-seen") === "true"; } catch { /* Storage is optional. */ }
    const animations = new Set<Animation>();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate([
          { opacity: .2, translate: "0 32px", filter: "blur(4px)" },
          { opacity: 1, translate: "0 0", filter: "blur(0px)" },
        ], { duration: 950, easing: "cubic-bezier(.16,1,.3,1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .12 });
    document.querySelectorAll("main .glass-panel:not(.trait-card):not(.room-card), main h2, main .community-button, main .play-button").forEach((el) => observer.observe(el));

    const stop = () => {
      if (!preference.matches) return;
      cancelled = true;
      setPhase("idle");
      timers.forEach(clearTimeout);
      animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stop);
    if (shouldPlayIntro(preference.matches, seen, Boolean(window.location.hash))) {
      const image = new Image();
      image.src = scare.url;
      image.decode().then(() => {
        if (cancelled || preference.matches) return;
        try { sessionStorage.setItem("mimic-intro-seen", "true"); } catch { /* No persistence needed. */ }
        setPhase("scare");
        timers.push(setTimeout(() => setPhase("fade"), SCARE_DURATION_MS));
        timers.push(setTimeout(() => setPhase("idle"), SCARE_DURATION_MS + INTRO_FADE_MS));
      }).catch(() => { /* Failed media must never prevent entry. */ });
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);

  if (phase === "idle") return null;
  return <div className={`cinematic-intro cinematic-${phase}`} aria-hidden="true" data-intro-phase={phase}>
    {phase === "scare" && <img src={scare.url} alt="" className="cinematic-creature" />}
    <div className="cinematic-shutter" />
  </div>;
}
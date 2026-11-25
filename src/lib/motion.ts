export const SCARE_DURATION_MS = 300;
export const INTRO_FADE_MS = 800;

export function shouldPlayIntro(reducedMotion: boolean, alreadySeen: boolean, hasAnchor: boolean) {
  return !reducedMotion && !alreadySeen && !hasAnchor;
}
/**
 * **Single hero model (default):** e.g. `frame-0.glb` in `public/models/hero/`:
 * `VITE_HERO_GLB_URL=/models/hero/frame-0.glb`
 *
 * **Multiple looks (optional):** comma-separated URLs (capped for sanity):
 * `VITE_HERO_GLB_FRAMES=/models/hero/a.glb,/models/hero/b.glb`
 *
 * Default: remote Xbot (fallback only when no env is set).
 */

const FALLBACK_GLB =
  'https://threejs.org/examples/models/gltf/Xbot.glb'

const MAX_FRAMES = 12

function resolveHeroFrameUrls(): readonly string[] {
  const framesEnv = import.meta.env.VITE_HERO_GLB_FRAMES
  if (typeof framesEnv === 'string' && framesEnv.trim().length > 0) {
    const parts = framesEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length > 0) return parts.slice(0, MAX_FRAMES)
  }

  const singleEnv = import.meta.env.VITE_HERO_GLB_URL
  if (typeof singleEnv === 'string' && singleEnv.trim().length > 0) {
    return [singleEnv.trim()]
  }

  return [FALLBACK_GLB]
}

export const HERO_MODEL_URLS = resolveHeroFrameUrls()

export const HERO_MODEL_URL = HERO_MODEL_URLS[0] ?? FALLBACK_GLB

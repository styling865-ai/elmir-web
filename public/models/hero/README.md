# Single hero GLB — `frame-0.glb`

Put **one** file in `public/models/hero/`:

`public/models/hero/frame-0.glb`

Project root `.env.local`:

```bash
VITE_HERO_GLB_URL=/models/hero/frame-0.glb
```

Restart `npm run dev`. The hero runs a smooth **360°** spin on that model (no dress carousel).

Optional: comma-separated `VITE_HERO_GLB_FRAMES` for multiple looks — otherwise use `VITE_HERO_GLB_URL` only.

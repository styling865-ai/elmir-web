import { Environment, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Suspense,
  useMemo,
  useState,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { motion } from 'motion/react'
import * as THREE from 'three'
import { useMatchMedia } from '../lib/useMatchMedia'
import { HERO_MODEL_URLS } from '../lib/heroModelUrl'
import { MagneticButton } from './ui/MagneticButton'

const DRESS_COUNT = HERO_MODEL_URLS.length

const AUTO_NEXT_MS = 5000
const AUTO_NEXT_MS_REDUCED = 5000

for (const url of new Set(HERO_MODEL_URLS)) {
  useGLTF.preload(url)
}

const _box = new THREE.Box3()
const _center = new THREE.Vector3()
const _size = new THREE.Vector3()

function FrontFraming({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const zSign =
    typeof import.meta.env.VITE_HERO_CAM_Z === 'string' &&
    import.meta.env.VITE_HERO_CAM_Z.toLowerCase() === 'back'
      ? -1
      : 1

  /* R3F framing: mutating the Three.js camera each frame is standard for this pattern. */
  /* eslint-disable react-hooks/immutability -- PerspectiveCamera near/far/position updated from bbox */
  useFrame(() => {
    const g = root.current
    if (!g) return
    _box.setFromObject(g)
    if (_box.isEmpty()) return
    _box.getCenter(_center)
    _box.getSize(_size)
    const maxDim = Math.max(_size.x, _size.y, _size.z, 0.001)
    const persp = camera instanceof THREE.PerspectiveCamera ? camera : null
    const vFov = persp
      ? THREE.MathUtils.degToRad(persp.fov)
      : THREE.MathUtils.degToRad(40)
    const dist = (maxDim * 1.34) / (2 * Math.tan(vFov / 2))

    camera.up.set(0, 1, 0)
    camera.position.set(_center.x, _center.y, _center.z + zSign * dist)
    camera.lookAt(_center)
    const nd = Math.max(dist, 0.001)
    camera.near = nd / 200
    camera.far = nd * 120
    camera.updateProjectionMatrix()
  })
  /* eslint-enable react-hooks/immutability */

  return <group ref={root}>{children}</group>
}

function DressModel({ url }: { url: string }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} />
}

function GarmentMotionGroup({
  rotationDeg,
  reduced,
  mouseNormRef,
  children,
}: {
  rotationDeg: number
  reduced: boolean
  mouseNormRef: MutableRefObject<{ x: number; y: number }>
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const smooth = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    let bob = 0
    let rxIdle = 0
    if (!reduced) {
      bob = Math.sin(t * 1.15) * 0.038
      rxIdle = Math.sin(t * 0.92) * 0.052
      const m = mouseNormRef.current
      const tx = Math.max(-1, Math.min(1, m.x))
      const ty = Math.max(-1, Math.min(1, m.y))
      smooth.current.x += (tx - smooth.current.x) * 0.07
      smooth.current.y += (ty - smooth.current.y) * 0.07
    } else {
      smooth.current.x = 0
      smooth.current.y = 0
    }
    const tiltX = reduced ? 0 : smooth.current.y * 0.11
    const tiltY = reduced ? 0 : smooth.current.x * 0.1
    const rad = THREE.MathUtils.degToRad(rotationDeg)
    g.position.y = bob
    g.rotation.set(rxIdle + tiltX, rad + tiltY, 0)
  })

  return <group ref={group}>{children}</group>
}

function Scene({
  dressIndex,
  rotationDeg,
  reduced,
  mouseNormRef,
}: {
  dressIndex: number
  rotationDeg: number
  reduced: boolean
  mouseNormRef: MutableRefObject<{ x: number; y: number }>
}) {
  const url = useMemo(() => {
    const i = ((dressIndex % DRESS_COUNT) + DRESS_COUNT) % DRESS_COUNT
    return HERO_MODEL_URLS[i]!
  }, [dressIndex])

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5.5, 10, 6]}
        intensity={1.05}
        color="#fffef9"
      />
      <directionalLight
        position={[-4, 4.5, -5]}
        intensity={0.42}
        color="#d4f5e8"
      />
      {!reduced ? (
        <Environment preset="forest" environmentIntensity={0.75} />
      ) : null}
      <hemisphereLight args={['#d8f0e6', '#4a5c42', 0.5]} />
      <FrontFraming>
        <GarmentMotionGroup
          rotationDeg={rotationDeg}
          reduced={reduced}
          mouseNormRef={mouseNormRef}
        >
          <DressModel key={url} url={url} />
        </GarmentMotionGroup>
      </FrontFraming>
    </>
  )
}

const BTN =
  'flex h-11 min-w-[3.25rem] items-center justify-center rounded-full border border-[rgba(220,248,236,0.32)] bg-[rgba(18,40,28,0.45)] px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#eafff3] transition-colors hover:border-[rgba(230,255,244,0.5)] hover:bg-[rgba(22,48,32,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--green-400)]'

export function ModelTurntable({
  rotationDeg,
  reducedMotion = false,
}: {
  rotationDeg: number
  reducedMotion?: boolean
}) {
  const [dressIndex, setDressIndex] = useState(0)
  const mouseNormRef = useRef({ x: 0, y: 0 })
  const canPointerTilt = useMatchMedia(
    '(hover: hover) and (pointer: fine)',
  )

  useEffect(() => {
    if (DRESS_COUNT <= 1) return
    const ms = reducedMotion ? AUTO_NEXT_MS_REDUCED : AUTO_NEXT_MS
    const id = window.setInterval(() => {
      setDressIndex((i) => (i + 1) % DRESS_COUNT)
    }, ms)
    return () => clearInterval(id)
  }, [reducedMotion])

  const onTrackMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !canPointerTilt) {
      mouseNormRef.current = { x: 0, y: 0 }
      return
    }
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1
    const ny = ((e.clientY - r.top) / Math.max(r.height, 1)) * 2 - 1
    mouseNormRef.current = { x: nx, y: -ny }
  }

  const onTrackLeave = () => {
    mouseNormRef.current = { x: 0, y: 0 }
  }

  const show = dressIndex + 1

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,480px)]">
      <div
        className="relative w-full"
        style={{
          height: 'min(58vh, 560px)',
          minHeight: 280,
        }}
        onPointerMove={onTrackMove}
        onPointerLeave={onTrackLeave}
      >
        <Canvas
          aria-label={
            DRESS_COUNT > 1
              ? `Dress ${show} of ${DRESS_COUNT}. Smooth 360° rotation.`
              : 'Hero dress preview with smooth 360° rotation.'
          }
          className="pointer-events-none !h-full !w-full"
          camera={{ position: [0, 1.15, 4.1], fov: 40 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
          dpr={[
            1,
            Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1),
          ]}
        >
          <Suspense fallback={null}>
            <Scene
              dressIndex={dressIndex}
              rotationDeg={rotationDeg}
              reduced={reducedMotion}
              mouseNormRef={mouseNormRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {DRESS_COUNT > 1 ? (
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 px-2">
            <MagneticButton
              className={BTN}
              aria-label="Previous dress"
              onClick={() =>
                setDressIndex((i) => (i - 1 + DRESS_COUNT) % DRESS_COUNT)
              }
            >
              Prev
            </MagneticButton>

            <div
              className="flex max-w-[240px] flex-wrap items-center justify-center gap-3"
              role="tablist"
              aria-label="Choose a dress"
            >
              {Array.from({ length: DRESS_COUNT }, (_, i) => {
                const active = i === dressIndex
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Dress ${i + 1} of ${DRESS_COUNT}`}
                    onClick={() => setDressIndex(i)}
                    className="relative flex h-3 w-3 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-400)]"
                  >
                    {active ? (
                      <>
                        <motion.span
                          className="pointer-events-none absolute inset-[-3px] rounded-full border border-[rgba(157,230,192,0.55)]"
                          animate={
                            reducedMotion
                              ? undefined
                              : {
                                  scale: [1, 1.2, 1],
                                  opacity: [0.55, 0.25, 0.55],
                                }
                          }
                          transition={
                            reducedMotion
                              ? undefined
                              : {
                                  duration: 2.2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }
                          }
                          aria-hidden
                        />
                        <span className="h-2 w-2 rounded-full bg-[#9de6c0] shadow-[0_0_12px_rgba(157,230,192,0.45)]" />
                      </>
                    ) : (
                      <span className="h-1.5 w-1.5 scale-90 rounded-full bg-[rgba(210,248,232,0.28)] transition-transform hover:scale-100 hover:bg-[rgba(210,248,232,0.45)]" />
                    )}
                  </button>
                )
              })}
            </div>

            <MagneticButton
              className={BTN}
              aria-label="Next dress"
              onClick={() => setDressIndex((i) => (i + 1) % DRESS_COUNT)}
            >
              Next
            </MagneticButton>
          </div>

          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a8c9bc]">
            Look {show} / {DRESS_COUNT} · 360° spin
          </p>
        </div>
      ) : (
        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a8c9bc]">
          360° spin
        </p>
      )}
    </div>
  )
}

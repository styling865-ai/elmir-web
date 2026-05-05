import { ContactShadows, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { HERO_MODEL_URLS } from '../../lib/heroModelUrl'

const HERO_URL = HERO_MODEL_URLS[0]!

useGLTF.preload(HERO_URL)

const _box = new THREE.Box3()
const _size = new THREE.Vector3()

function DressModel({ url, targetHeight }: { url: string; targetHeight: number }) {
  const gltf = useGLTF(url)
  useLayoutEffect(() => {
    /* eslint-disable react-hooks/immutability -- one-time GLTF scene prep */
    const root = gltf.scene
    /* useGLTF caches the scene; scale/position survive unmount — reset so each mount fits from source bounds. */
    root.scale.set(1, 1, 1)
    root.position.set(0, 0, 0)
    root.rotation.set(0, 0, 0)
    root.quaternion.identity()
    root.updateMatrixWorld(true)

    root.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
    _box.setFromObject(root)
    if (_box.isEmpty()) return
    _box.getSize(_size)
    const h = Math.max(_size.y, 0.001)
    const target = targetHeight
    const s = target / h
    root.scale.setScalar(s)
    _box.setFromObject(root)
    const c = new THREE.Vector3()
    _box.getCenter(c)
    root.position.sub(c)
    _box.setFromObject(root)
    root.position.y -= _box.min.y
    root.updateMatrixWorld(true)
    /* eslint-enable react-hooks/immutability */
  }, [gltf, targetHeight])
  return <primitive object={gltf.scene} />
}

/** Hero studio composite: no scene.background so the DOM image shows through the canvas. */
function TransparentHeroClear() {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)
  useLayoutEffect(() => {
    const prev = scene.background
    scene.background = null
    gl.setClearColor(0x000000, 0)
    return () => {
      scene.background = prev
    }
  }, [scene, gl])
  return null
}

function GarmentGroup({
  reduced,
  draggingRef,
  rotationSpeed,
  angleRef,
  targetHeight,
  contactShadowLight,
}: {
  reduced: boolean
  draggingRef: MutableRefObject<boolean>
  rotationSpeed: number
  angleRef: MutableRefObject<number>
  targetHeight: number
  contactShadowLight: boolean
}) {
  const turntableRef = useRef<THREE.Group>(null)
  /** Smoothed Y spin for idle auto-rotate; snaps while dragging for responsive drag. */
  const spinVisual = useRef(0)

  useFrame((_, dt) => {
    const turntable = turntableRef.current
    if (!turntable) return

    if (!reduced && !draggingRef.current) {
      angleRef.current += rotationSpeed * dt
    }

    if (draggingRef.current || reduced) {
      spinVisual.current = angleRef.current
    } else {
      const k = 12
      spinVisual.current += (angleRef.current - spinVisual.current) * Math.min(1, k * dt)
    }

    turntable.rotation.set(0, spinVisual.current, 0)
  })

  return (
    <group position={[0, 0.02, 0]}>
      <group ref={turntableRef}>
        <DressModel url={HERO_URL} targetHeight={targetHeight} />
        {!reduced ? (
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={contactShadowLight ? 0.22 : 0.55}
            scale={9}
            blur={contactShadowLight ? 1.8 : 2.2}
            far={6}
            color={contactShadowLight ? '#6b7280' : '#000000'}
          />
        ) : null}
      </group>
    </group>
  )
}

function Scene({
  reduced,
  draggingRef,
  angleRef,
  targetHeight,
  variant,
}: {
  reduced: boolean
  draggingRef: MutableRefObject<boolean>
  angleRef: MutableRefObject<number>
  targetHeight: number
  variant: 'dark' | 'light'
}) {
  const light = variant === 'light'
  const th = targetHeight
  const camPos = light
    ? ([0, 0.95 + th * 0.2, 5.75 + th * 0.42] as const)
    : ([0, 1.05, 5.45] as const)
  const camFov = light ? 44 : 36
  const lookY = light ? th * 0.49 : 0.95

  return (
    <>
      {light ? <TransparentHeroClear /> : <color attach="background" args={['#050505']} />}
      <PerspectiveCamera
        makeDefault
        position={camPos}
        fov={camFov}
        near={0.2}
        far={50}
        onUpdate={(c) => c.lookAt(0, lookY, 0)}
      />
      {light ? (
        <hemisphereLight args={['#f5f5f4', '#c5cac4', 0.62]} />
      ) : (
        <hemisphereLight args={['#e8e4dc', '#1a1c18', 0.45]} />
      )}
      <ambientLight intensity={light ? 0.5 : 0.22} color={light ? '#ffffff' : '#d8ded8'} />
      <directionalLight
        position={[0, 14, 4]}
        intensity={light ? 1.15 : 2.1}
        color="#fffef7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={28}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight
        position={[9, 3.5, 2]}
        intensity={light ? 0.65 : 1.05}
        color="#e8cf7a"
      />
      <directionalLight
        position={[-9, 3, 3]}
        intensity={light ? 0.35 : 0.55}
        color="#6da06d"
      />
      <directionalLight position={[2, 2, 8]} intensity={light ? 0.42 : 0.35} color="#ffffff" />
      <GarmentGroup
        reduced={reduced}
        draggingRef={draggingRef}
        rotationSpeed={reduced ? 0 : 0.35}
        angleRef={angleRef}
        targetHeight={targetHeight}
        contactShadowLight={light}
      />
    </>
  )
}

type Props = {
  reducedMotion: boolean
  className?: string
  modelTargetHeight?: number
  variant?: 'dark' | 'light'
}

export function HeroGarmentStage({
  reducedMotion,
  className = '',
  modelTargetHeight = 1.82,
  variant = 'dark',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const lastPointerX = useRef(0)
  const angleRef = useRef(0)

  const onPointerMove = (e: React.PointerEvent) => {
    if (draggingRef.current && !reducedMotion) {
      const dx = e.clientX - lastPointerX.current
      lastPointerX.current = e.clientX
      angleRef.current += dx * 0.0042
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (reducedMotion) return
    draggingRef.current = true
    lastPointerX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onLeave = () => {
    draggingRef.current = false
  }

  return (
    <div
      ref={wrapRef}
      className={`relative isolate h-full w-full bg-transparent ${reducedMotion ? 'touch-pan-y' : 'touch-none'} ${className}`}
      style={{ minHeight: 'inherit', touchAction: reducedMotion ? undefined : 'none' }}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onLeave}
    >
      <Canvas
        className="h-full w-full cursor-grab active:cursor-grabbing will-change-transform bg-transparent"
        style={{ background: 'transparent' }}
        shadows
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          if (variant === 'light') {
            gl.setClearColor(0xffffff, 0)
          } else {
            gl.setClearColor(0x000000, 0)
          }
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
      >
        <Suspense fallback={null}>
          <Scene
            reduced={reducedMotion}
            draggingRef={draggingRef}
            angleRef={angleRef}
            targetHeight={modelTargetHeight}
            variant={variant}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

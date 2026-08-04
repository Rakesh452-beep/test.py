"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

/* ─────────────────────────────────────────────────────────────
   Cinematic cricket shot — real Virat Kohli FBX model.
   Batting animation loops, rendered transparent over the page's
   dark background so it blends with the hero (no card / border).
   Character albedo:  Virat_Kohli_Diffuse.png
   Bat albedo:        aiStandardSurface2SG_baseColor.png
   The render loop pauses when the hero scrolls out of view so
   page scrolling stays smooth.
   ───────────────────────────────────────────────────────────── */

export const CRICKET_LOOP_DURATION = 7.0;

const MODEL_URL = "/models/kohli/kohli.fbx";
const CHARACTER_TEX = "/textures/Virat_Kohli_Diffuse.png";
const BAT_TEX = "/textures/aiStandardSurface2SG_baseColor.png";
const TARGET_HEIGHT = 2.1;

/* bake a uniform scale into geometry + bones + bind matrices so skinned
   skinning stays consistent while the animation mixer runs */
/* normalize the whole loaded model with a UNIFORM group scale. Scaling the
   top-level group (instead of mutating geometry + bones) keeps the skinning
   bind matrices, node transforms and animation keyframes all consistent:
   every matrix picks up the same scale factor, so the mixamo clip plays
   correctly in the new units without touching its tracks. */
function frameModel(model: THREE.Group, targetHeight: number) {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const s = targetHeight / Math.max(size.y, 1e-4);
  model.scale.setScalar(s);
  model.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(model);
  const center = box2.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box2.min.y, -center.z);
  model.updateMatrixWorld(true);
  return s;
}

/* an unsupported .fbm texture reference inside the FBX would trigger a 404.
   Redirect every request for those to a 1x1 transparent PNG so the console
   stays clean. */
function makeLoader() {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) =>
    url.toLowerCase().endsWith(".fbm")
      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
      : url
  );
  return new FBXLoader(manager);
}

function KohliModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const hipsRef = useRef<THREE.Object3D | null>(null);
  const anchorRef = useRef<THREE.Vector3 | null>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const loader = makeLoader();
    const group = groupRef.current;
    if (!group) return;
    let disposed = false;

    const onLoad = (obj: THREE.Group) => {
      if (disposed) return;
      if (typeof window !== "undefined") {
        (window as any).__kohli = { state: "loaded", meshes: obj.children.length };
      }

      /* normalize: uniform group scale -> fit height, feet on the floor,
         centered on x/z. Also rotates the whole rig so he faces the camera. */
      frameModel(obj, TARGET_HEIGHT);
      group.rotation.y = 0.5;

      /* materials: Diffuse on character, baseColor on bat */
      const texLoader = new THREE.TextureLoader();
      const charTex = texLoader.load(CHARACTER_TEX);
      const batTex = texLoader.load(BAT_TEX);
      charTex.colorSpace = THREE.SRGBColorSpace;
      batTex.colorSpace = THREE.SRGBColorSpace;

      obj.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const isBat = mesh.name === "Cricket_Bat";
        const mat = new THREE.MeshStandardMaterial({
          map: isBat ? batTex : charTex,
          roughness: isBat ? 0.34 : 0.62,
          metalness: isBat ? 0.12 : 0.03,
        });
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });

      /* animation: use the clean mixamo layer clip, loop it */
      const raw =
        obj.animations.find((c) => c.name.includes("Layer0")) || obj.animations[0];
      const mixer = new THREE.AnimationMixer(obj);
      const action = mixer.clipAction(raw);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
      mixerRef.current = mixer;
      hipsRef.current = obj.getObjectByName("mixamorigHips") ?? null;

      group.add(obj);

      if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
          if (disposed) return;
          group.updateMatrixWorld(true);
          const b = new THREE.Box3().setFromObject(obj);
          const cam = (window as any).__kohli?.camera;
          const info: any = {
            state: "loaded",
            meshes: obj.children.length,
            boxMin: b.min.toArray(),
            boxMax: b.max.toArray(),
            boxSize: b.getSize(new THREE.Vector3()).toArray(),
            groupPos: group.position.toArray(),
            groupRot: group.rotation.toArray(),
            anims: obj.animations.map((c) => c.name),
            camera: cam ? { pos: cam.position.toArray(), fov: cam.fov } : null,
          };
          obj.traverse((c) => {
            const m = c as THREE.Mesh;
            if (!m.isMesh) return;
            const mat = m.material as THREE.MeshStandardMaterial;
            const t = mat.map as THREE.Texture | null;
            info.mat = {
              mesh: m.name,
              matType: mat ? mat.type : null,
              mapLoaded: t ? (t.image && (t.image as HTMLImageElement).complete) : null,
              mapSize: t && t.image ? `${(t.image as HTMLImageElement).naturalWidth || 0}x${(t.image as HTMLImageElement).naturalHeight || 0}` : null,
            };
          });
          (window as any).__kohli = { ...((window as any).__kohli || {}), ...info };
        });
      }
    };

    loader.load(MODEL_URL, onLoad, undefined, (e: unknown) => {
      if (typeof window !== "undefined") {
        (window as any).__kohli = { state: "failed", error: String((e as Error)?.message || e) };
      }
      setFailed(true);
    });

    return () => {
      disposed = true;
      mixerRef.current?.stopAllAction();
      mixerRef.current = null;
      group.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      group.clear();
    };
  }, []);

  useFrame((_, delta) => {
    const mixer = mixerRef.current;
    if (mixer) mixer.update(Math.min(delta, 0.05));

    /* soft anchor on the hips so the shot stays centered in frame */
    const group = groupRef.current;
    const hips = hipsRef.current;
    if (group && hips) {
      hips.getWorldPosition(tmp);
      if (!anchorRef.current) anchorRef.current = tmp.clone();
      const k = 1 - Math.exp(-delta * 3.2);
      group.position.x += (anchorRef.current.x - tmp.x) * k;
      group.position.z += (anchorRef.current.z - tmp.z) * k;
    }
  });

  if (failed) return null;
  return <group ref={groupRef} />;
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 1.05, 0);
    if (typeof window !== "undefined") {
      (window as any).__kohli = { ...(window as any).__kohli, camera };
    }
  }, [camera]);
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} color="#bcd0ff" />
      <directionalLight
        position={[3.2, 4.2, 2.4]}
        intensity={2.1}
        color="#fff2dd"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
      />
      <directionalLight position={[-4, 2.2, -3]} intensity={1.3} color="#7fd4ff" />
      <directionalLight position={[0.6, 1.2, -2.6]} intensity={0.7} color="#d4ff00" />
      <KohliModel />
      <CameraRig />
    </>
  );
}

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function FallbackImage() {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-cricket.jpeg"
        alt="Virat Kohli batting"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

class CanvasBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function Cricket3DScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [webglOk] = useState<boolean>(() => isWebGLAvailable());

  /* mount after first paint (SSR guard) */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* lighten the render on small screens */
  useEffect(() => {
    setIsMobile(
      typeof window !== "undefined" &&
        (window.matchMedia?.("(max-width: 767px)").matches ?? false)
    );
  }, []);

  /* pause the WebGL loop when the hero scrolls out of view */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? true),
      { rootMargin: "150px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!ready) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4FF00] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!webglOk) return <FallbackImage />;

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <CanvasBoundary fallback={<FallbackImage />}>
        <Canvas
          shadows={!isMobile}
          frameloop={visible ? "always" : "never"}
          dpr={isMobile ? [1, 1.5] : [1, 1.25]}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
          camera={{ fov: 42, position: [1.9, 1.35, 2.9], near: 0.1, far: 100 }}
        >
          <Scene />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}

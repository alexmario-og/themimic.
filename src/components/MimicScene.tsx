import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBX, Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import mimicAsset from "@/assets/mimic.fbx.asset.json";

const TARGET_HEIGHT = 3.4;
// The model's embedded texture files are missing; serve a blank pixel instead so no
// requests 404. The mesh uses its own grey skin material below.
const BLANK_PX = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
THREE.DefaultLoadingManager.setURLModifier((u) => (/(\.(png|jpe?g|tga|bmp)|\/Image_[0-9_]+)(\?|$)/i.test(u) && !u.startsWith("data:") ? BLANK_PX : u));

function Mimic({ onReady, reducedMotion }: { onReady: () => void; reducedMotion: boolean }) {
  const fbx = useFBX(mimicAsset.url);
  const group = useRef<THREE.Group>(null);
  const mixer = useMemo(() => new THREE.AnimationMixer(fbx), [fbx]);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const s = TARGET_HEIGHT / (size.y || 1);
    fbx.scale.setScalar(s);
    const b2 = new THREE.Box3().setFromObject(fbx);
    const c = b2.getCenter(new THREE.Vector3());
    fbx.position.x -= c.x;
    fbx.position.y -= b2.min.y + TARGET_HEIGHT / 2;
    fbx.position.z -= c.z;
    const skin = new THREE.MeshStandardMaterial({ color: "#bdbab5", roughness: 0.7, metalness: 0.05 });
    fbx.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) { m.material = skin; m.castShadow = true; m.receiveShadow = true; }
    });
    const clip = fbx.animations[0];
    if (clip) mixer.clipAction(clip).play();
    onReady();
  }, [fbx, mixer, onReady]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (reducedMotion) return;
    mixer.update(dt);
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Slow uneasy sway plus a twitch every few seconds; leans toward the cursor.
    const twitch = Math.sin(t * 0.7) > 0.985 ? Math.sin(t * 60) * 0.04 : 0;
    const targetY = state.pointer.x * 0.35 + Math.sin(t * 0.25) * 0.08;
    group.current.rotation.y += (targetY - group.current.rotation.y) * (1 - Math.exp(-2 * dt));
    group.current.rotation.z = Math.sin(t * 0.4) * 0.015 + twitch;
  });

  return (
    <group ref={group}>
      <primitive object={fbx} />
    </group>
  );
}

function FlickerLight({ reducedMotion }: { reducedMotion: boolean }) {
  const l = useRef<THREE.SpotLight>(null);
  useFrame((s) => {
    if (!l.current) return;
    if (reducedMotion) { l.current.intensity = 34; return; }
    const t = s.clock.elapsedTime;
    const off = Math.sin(t * 1.3) > 0.97 || Math.sin(t * 7.1) > 0.995;
    l.current.intensity = off ? 4 : 34 + Math.sin(t * 40) * 2;
  });
  return <spotLight ref={l} position={[1.5, 5, 2.5]} angle={0.45} penumbra={0.9} intensity={60} color="#f2ece0" castShadow />;
}

export default function MimicScene() {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className="h-full w-full" data-scene-ready={ready ? "true" : undefined}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.2, 7.2], fov: 35 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#0b0b0b", 5, 11]} />
        <ambientLight intensity={0.08} />
        <ResponsiveCamera />
        <FlickerLight reducedMotion={reducedMotion} />
        <pointLight position={[-2.5, 1, -2]} intensity={14} color="#8a1c14" />
        <directionalLight position={[0, 2, -4]} intensity={2.4} color="#b9c4c2" />
        <Environment resolution={64}>
          <Lightformer intensity={0.6} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={0.3} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Mimic onReady={() => setReady(true)} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.z = size.width / size.height < .9 ? 10 : 7.2;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

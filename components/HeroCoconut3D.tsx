"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

function CoconutModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/3d/coconut.glb");
  const { shouldReduce } = useCoconutMotionMode();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y += shouldReduce ? 0.0015 : 0.0035;
    groupRef.current.position.y = shouldReduce ? 0 : Math.sin(time * 0.55) * 0.055;
  });

  return (
    <group ref={groupRef} scale={2.25} rotation={[0.08, -0.32, -0.06]}>
      <primitive object={scene} />
    </group>
  );
}

function CoconutFallback() {
  return (
    <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_38%_30%,#D8C07A_0,#3e2e1f_44%,#2d2d2d_100%)] shadow-[inset_-28px_-24px_60px_rgba(0,0,0,0.22),0_34px_90px_rgba(62,46,31,0.2)]" />
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function HeroCoconut3D() {
  const { shouldReduce } = useCoconutMotionMode();
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    setCanRender3D(!shouldReduce && supportsWebGL());
  }, [shouldReduce]);

  if (shouldReduce || !canRender3D) {
    return (
      <div className="relative h-[330px] w-[330px] md:h-[470px] md:w-[470px]">
        <div className="absolute inset-x-12 bottom-8 h-8 rounded-full bg-ink/10 blur-xl" />
        <CoconutFallback />
      </div>
    );
  }

  return (
    <div className="relative h-[330px] w-[330px] md:h-[470px] md:w-[470px]">
      <div className="absolute inset-x-12 bottom-8 h-8 rounded-full bg-ink/10 blur-xl" />
      <Canvas
        shadows
        camera={{ position: [0, 0.18, 5.2], fov: 34 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} castShadow />
        <spotLight position={[-3, 3, 4]} intensity={0.8} angle={0.42} penumbra={0.6} />
        <Suspense fallback={null}>
          <CoconutModel />
          <Environment preset="studio" />
        </Suspense>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.46, 0]} receiveShadow>
          <circleGeometry args={[1.45, 64]} />
          <shadowMaterial opacity={0.18} />
        </mesh>
      </Canvas>
      <noscript>
        <CoconutFallback />
      </noscript>
    </div>
  );
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { type Group, Vector3 } from "three";
import { getTextDots } from "@/lib/dotMatrixFont";

const TOTAL_DOTS = 1000;
const DOT_SIZE = 0.08;
const DOT_SPACING = 0.2;
const OFF_SCREEN_Y = -50;

interface DotTarget {
  x: number;
  y: number;
  z: number;
  active: boolean;
}

function DotMatrixText({ text }: { text: string }) {
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const currentPositions = useRef<Vector3[]>(
    Array.from({ length: TOTAL_DOTS }, () => new Vector3(0, OFF_SCREEN_Y, 0)),
  );

  // Calculate target positions based on text
  const targets = useMemo<DotTarget[]>(() => {
    const textDots = getTextDots(text, 1);

    // Create targets for all 1000 dots
    const allTargets: DotTarget[] = [];

    // First, add all text dots
    for (let i = 0; i < TOTAL_DOTS; i++) {
      if (i < textDots.length) {
        allTargets.push({
          x: textDots[i].x * DOT_SPACING,
          y: textDots[i].y * DOT_SPACING,
          z: 0,
          active: true,
        });
      } else {
        // Unused dots go off-screen in a scattered pattern
        const angle = (i / TOTAL_DOTS) * Math.PI * 20;
        const radius = 5 + (i % 10) * 0.5;
        allTargets.push({
          x: Math.cos(angle) * radius,
          y: OFF_SCREEN_Y + Math.sin(angle) * 2,
          z: Math.sin(angle) * radius,
          active: false,
        });
      }
    }

    return allTargets;
  }, [text]);

  useFrame((_, delta) => {
    const speed = 5;

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      const target = targets[i];
      const current = currentPositions.current[i];

      // Smoothly interpolate to target
      current.x += (target.x - current.x) * delta * speed;
      current.y += (target.y - current.y) * delta * speed;
      current.z += (target.z - current.z) * delta * speed;

      mesh.position.copy(current);

      // Fade opacity based on active state and Y position
      const material = mesh.material as THREE.MeshBasicMaterial;
      const targetOpacity = target.active ? 1 : 0;
      const currentOpacity = material.opacity;
      material.opacity += (targetOpacity - currentOpacity) * delta * speed;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
        <mesh
          key={`dot-${i}`}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[0, OFF_SCREEN_Y, 0]}
        >
          <sphereGeometry args={[DOT_SIZE, 8, 8]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

export default function Home() {
  const [text, setText] = useState("HELLO");

  return (
    <div className="relative h-screen w-screen bg-black">
      {/* Input field */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          className="px-6 py-3 text-2xl bg-black/50 border border-green-500/50 rounded-lg text-green-400 placeholder-green-800 focus:outline-none focus:border-green-400 text-center min-w-[300px]"
          maxLength={15}
        />
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <DotMatrixText text={text} />
      </Canvas>
    </div>
  );
}

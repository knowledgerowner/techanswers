"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

const techItems = [
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#000000" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Node.js", color: "#339933" },
  { name: "MongoDB", color: "#47a248" },
  { name: "Prisma", color: "#2d3748" },
  { name: "Tailwind", color: "#06b6d4" },
  { name: "Three.js", color: "#000000" },
];

export function TechGrid() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {techItems.map((tech, index) => {
        const angle = (index / techItems.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={tech.name} position={[x, 0, z]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial 
              color={tech.color}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
} 
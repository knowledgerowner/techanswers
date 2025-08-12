"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Points, BufferGeometry, Float32BufferAttribute } from "three";
import { Points as PointsImpl } from "@react-three/drei";

export function RotatingSphere() {
  const sphereRef = useRef<Mesh>(null);
  const pointsRef = useRef<Points>(null);

  // Créer des particules
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = 2 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#10b981" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
      <PointsImpl ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <pointsMaterial
          size={0.05}
          color="#10b981"
          transparent
          opacity={0.8}
        />
      </PointsImpl>
    </group>
  );
} 
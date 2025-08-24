"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function GPOIconModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation lente
      meshRef.current.rotation.y += 0.005;
      
      // Animation de flottement
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    
    if (groupRef.current) {
      // Rotation du groupe pour un effet plus dynamique
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <group ref={meshRef}>
          {/* Icône GPO - Structure principale */}
          <mesh position={[0, 0, 0]}>
            {/* Base de l'icône (cercle principal) */}
            <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
            <meshStandardMaterial 
              color="#4f46e5" 
              metalness={0.3}
              roughness={0.2}
            />
          </mesh>

          {/* Anneau extérieur */}
          <mesh position={[0, 0, 0.06]}>
            <torusGeometry args={[0.9, 0.05, 16, 32]} />
            <meshStandardMaterial 
              color="#6366f1" 
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>

          {/* Icône de document au centre */}
          <group position={[0, 0, 0.1]}>
            {/* Document principal */}
            <mesh>
              <boxGeometry args={[0.4, 0.5, 0.02]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>

            {/* Coin plié du document */}
            <mesh position={[0.15, 0.2, 0.02]}>
              <boxGeometry args={[0.1, 0.1, 0.02]} />
              <meshStandardMaterial 
                color="#f3f4f6" 
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>

            {/* Lignes de texte sur le document */}
            {[...Array(4)].map((_, i) => (
              <mesh key={i} position={[0, 0.1 - i * 0.08, 0.12]}>
                <boxGeometry args={[0.25, 0.02, 0.005]} />
                <meshStandardMaterial 
                  color="#6b7280" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            ))}

            {/* Icône de clé (pour représenter la politique) */}
            <group position={[0, -0.15, 0.12]}>
              {/* Anneau de la clé */}
              <mesh>
                <torusGeometry args={[0.03, 0.01, 8, 16]} />
                <meshStandardMaterial 
                  color="#f59e0b" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              
              {/* Tige de la clé */}
              <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[0.02, 0.08, 0.01]} />
                <meshStandardMaterial 
                  color="#f59e0b" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>

              {/* Dents de la clé */}
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.06, 0.02, 0.01]} />
                <meshStandardMaterial 
                  color="#f59e0b" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            </group>
          </group>

          {/* Particules flottantes autour de l'icône */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 1.2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius * 0.5,
                  0
                ]}
              >
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial 
                  color="#8b5cf6" 
                  emissive="#8b5cf6"
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
        </group>
      </Float>
    </group>
  );
}

interface GPOSceneProps {
  className?: string;
}

export function GPOScene({ className }: GPOSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5} 
          color="#8b5cf6" 
        />
        
        <GPOIconModel />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export default GPOScene; 
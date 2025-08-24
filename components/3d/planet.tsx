"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, TextureLoader, Color, Vector2 } from "three";
import * as THREE from "three";

export function Planet() {
  const planetRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  // Texture de la planète plus détaillée et moderne
  const planetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Créer un dégradé de base plus sophistiqué
    const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 400);
    gradient.addColorStop(0, '#0f172a'); // Bleu très foncé au centre
    gradient.addColorStop(0.3, '#1e293b'); // Bleu foncé
    gradient.addColorStop(0.6, '#334155'); // Gris bleu
    gradient.addColorStop(1, '#0f172a'); // Retour au bleu foncé
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ajouter des continents avec des formes plus organiques
    const continents = [
      { x: 200, y: 150, size: 80, color: '#10b981' },
      { x: 600, y: 200, size: 120, color: '#059669' },
      { x: 800, y: 100, size: 60, color: '#047857' },
      { x: 300, y: 350, size: 90, color: '#065f46' },
      { x: 750, y: 380, size: 70, color: '#064e3b' },
    ];

    continents.forEach(continent => {
      // Forme principale du continent
      ctx.fillStyle = continent.color;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const radius = continent.size + Math.sin(angle * 3) * 20 + Math.cos(angle * 5) * 10;
        const x = continent.x + Math.cos(angle) * radius;
        const y = continent.y + Math.sin(angle) * radius * 0.6;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Détails du continent
      ctx.fillStyle = new Color(continent.color).multiplyScalar(0.8).getHexString();
      for (let i = 0; i < 5; i++) {
        const detailX = continent.x + (Math.random() - 0.5) * continent.size;
        const detailY = continent.y + (Math.random() - 0.5) * continent.size * 0.6;
        const detailSize = 10 + Math.random() * 20;
        ctx.beginPath();
        ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Ajouter des îles plus petites
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 3 + Math.random() * 8;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }, []);

  // Texture des nuages plus réaliste
  const cloudsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Systèmes nuageux plus réalistes
    const cloudSystems = [
      { x: 150, y: 100, size: 100, opacity: 0.9 },
      { x: 400, y: 250, size: 150, opacity: 0.7 },
      { x: 700, y: 150, size: 80, opacity: 0.8 },
      { x: 200, y: 400, size: 120, opacity: 0.6 },
      { x: 800, y: 350, size: 90, opacity: 0.75 },
    ];

    cloudSystems.forEach(system => {
      // Nuage principal
      ctx.fillStyle = `rgba(255, 255, 255, ${system.opacity})`;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
        const radius = system.size + Math.sin(angle * 4) * 15;
        const x = system.x + Math.cos(angle) * radius;
        const y = system.y + Math.sin(angle) * radius * 0.5;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Détails nuageux
      ctx.fillStyle = `rgba(255, 255, 255, ${system.opacity * 0.5})`;
      for (let i = 0; i < 8; i++) {
        const detailX = system.x + (Math.random() - 0.5) * system.size * 1.5;
        const detailY = system.y + (Math.random() - 0.5) * system.size * 0.8;
        const detailSize = 20 + Math.random() * 40;
        ctx.beginPath();
        ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return canvas;
  }, []);

  // Normal map pour plus de relief
  const normalTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Créer une normal map basique
    const gradient = ctx.createRadialGradient(256, 128, 0, 256, 128, 200);
    gradient.addColorStop(0, '#8080ff');
    gradient.addColorStop(0.5, '#7f7fff');
    gradient.addColorStop(1, '#8080ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
  }, []);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.05; // Rotation plus lente
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.08; // Nuages légèrement plus rapides
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      // Effet de pulsation pour l'atmosphère
      const scale = 2.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      atmosphereRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      // Effet de glow pulsant
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity = intensity;
    }
  });

  return (
    <group>
      {/* Planète principale avec matériaux améliorés */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2, 128, 64]} />
        <meshStandardMaterial 
          map={new TextureLoader().load(planetTexture.toDataURL())}
          normalMap={new TextureLoader().load(normalTexture.toDataURL())}
          normalScale={new Vector2(0.3, 0.3)}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Couche de nuages */}
      <mesh ref={cloudsRef} scale={[2.02, 2.02, 2.02]}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial 
          map={new TextureLoader().load(cloudsTexture.toDataURL())}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphère */}
      <mesh ref={atmosphereRef} scale={[2.3, 2.3, 2.3]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial 
          color="#4ade80"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Effet de glow externe */}
      <mesh ref={glowRef} scale={[2.6, 2.6, 2.6]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial 
          color="#22d3ee"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Champ d'étoiles amélioré */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(1000 * 3).map(() => (Math.random() - 0.5) * 50), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation={false}
        />
      </points>

      {/* Anneaux planétaires optionnels */}
      <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]} scale={[1, 1, 0.1]}>
        <ringGeometry args={[2.8, 3.2, 64]} />
        <meshStandardMaterial 
          color="#60a5fa"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Deuxième anneau pour plus d'effet */}
      <mesh rotation={[Math.PI / 2 - 0.1, 0, 0]} scale={[1, 1, 0.1]}>
        <ringGeometry args={[3.5, 3.8, 64]} />
        <meshStandardMaterial 
          color="#34d399"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
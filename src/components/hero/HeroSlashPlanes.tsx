'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SlashPlaneProps {
  basePosition: [number, number, number];
  baseRotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  speed?: number;
  driftSpeed?: number;
  rotationSpeed?: number;
  parallaxFactor?: number;
  phaseOffset?: number;
}

function LivingSlashPlane({
  basePosition,
  baseRotation,
  scale,
  color,
  speed = 0.4,
  driftSpeed = 0.35,
  rotationSpeed = 0.25,
  parallaxFactor = 0.4,
  phaseOffset = 0,
}: SlashPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;

        void main() {
          vUv = uv;
          vNormal = normal;
          vec3 pos = position;

          // Continuous organic surface flex bending (~3x amplitude)
          float waveX = sin(pos.x * 1.2 + uTime * 0.8 + ${phaseOffset.toFixed(2)}) * 0.32;
          float waveY = cos(pos.y * 1.4 + uTime * 0.6 + ${phaseOffset.toFixed(2)}) * 0.22;
          pos.z += waveX + waveY;
          vElevation = pos.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;

        void main() {
          // Colors: White, Graphite, Indigo/Electric Blue/Cyan/Violet
          vec3 white     = vec3(0.99, 0.99, 1.0);
          vec3 graphite  = vec3(0.12, 0.16, 0.22);
          vec3 accentCol = uColor;

          // Shifting internal color gradient
          float shift = sin(uTime * 0.4 + vUv.x * 3.14 + ${phaseOffset.toFixed(2)}) * 0.5 + 0.5;
          vec3 gradColor = mix(accentCol, mix(accentCol, white, 0.45), shift);

          float grad = vUv.x * 0.7 + vUv.y * 0.3;
          vec3 baseColor = mix(white, gradColor, grad * 0.4);
          baseColor = mix(baseColor, graphite, (1.0 - vUv.y) * 0.15);

          // Glass Edge Specular Highlight
          float edgeX = smoothstep(0.0, 0.03, vUv.x) * (1.0 - smoothstep(0.97, 1.0, vUv.x));
          float edgeY = smoothstep(0.0, 0.03, vUv.y) * (1.0 - smoothstep(0.97, 1.0, vUv.y));
          float border = 1.0 - (edgeX * edgeY);
          vec3 rimLight = vec3(0.92, 0.95, 1.0) * pow(border, 2.5) * 0.6;
          baseColor += rimLight;

          // Traveling Sunlight Reflection across glass surface
          float sunlightSweep = sin(vUv.x * 5.0 - uTime * 1.0 + ${phaseOffset.toFixed(2)}) * 0.5 + 0.5;
          vec3 travelingSunlight = vec3(1.0, 0.96, 0.92) * pow(sunlightSweep, 4.0) * 0.45;
          baseColor += travelingSunlight;

          // Translucent acrylic opacity
          float opacity = 0.78 * (0.65 + 0.35 * sin(vUv.y * 3.1415));

          gl_FragColor = vec4(baseColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [color, phaseOffset]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Amplified Independent Translation Drift (~3x motion)
    const driftY = Math.sin(time * driftSpeed + phaseOffset) * 0.38;
    const driftX = Math.cos(time * driftSpeed * 0.8 + phaseOffset) * 0.28;
    const driftZ = Math.sin(time * driftSpeed * 0.6 + phaseOffset) * 0.15;

    // 2. Mouse Parallax response
    const targetMouseX = state.pointer.x * parallaxFactor;
    const targetMouseY = state.pointer.y * parallaxFactor;

    meshRef.current.position.x = basePosition[0] + driftX + targetMouseX;
    meshRef.current.position.y = basePosition[1] + driftY + targetMouseY;
    meshRef.current.position.z = basePosition[2] + driftZ;

    // 3. Amplified Independent Rotation & Scaling Pulse
    const scalePulse = 1.0 + Math.sin(time * 0.4 + phaseOffset) * 0.04;
    meshRef.current.scale.set(scale[0] * scalePulse, scale[1] * scalePulse, scale[2]);

    meshRef.current.rotation.z = baseRotation[2] + Math.sin(time * rotationSpeed + phaseOffset) * 0.08;
    meshRef.current.rotation.x = baseRotation[0] + Math.cos(time * rotationSpeed * 0.7 + phaseOffset) * 0.06;
    meshRef.current.rotation.y = baseRotation[1] + Math.sin(time * rotationSpeed * 0.5 + phaseOffset) * 0.04;

    // 4. Update shader uniform
    shaderMaterial.uniforms.uTime.value = time * speed;
    shaderMaterial.uniforms.uMouse.value.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
  });

  return (
    <mesh ref={meshRef} position={basePosition} rotation={baseRotation} scale={scale}>
      <planeGeometry args={[1, 1, 48, 48]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// Camera Controller with Continuous Orbit Drift & Scroll Parallax
function ScrollCameraController() {
  const { camera } = useThree();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Slow continuous camera orbit drift
    const orbitX = Math.sin(time * 0.25) * 0.25;
    const orbitY = Math.cos(time * 0.2) * 0.18;

    // Scroll depth tracking
    const targetY = -scrollY * 0.0008 + orbitY;
    const targetZ = 5 + scrollY * 0.0015;

    camera.position.x += (orbitX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
  });

  return null;
}

export default function HeroSlashPlanes() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-white pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[8, 12, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[6, -4, 4]} intensity={0.6} color="#635bff" />
        <pointLight position={[-4, 6, -2]} intensity={0.4} color="#3b82f6" />

        <ScrollCameraController />

        {/* Noticeably Living 3D Floating Slash Planes (~3x Motion Amplitude) */}
        {/* Plane 1: Foreground Violet Accent (High Mouse Responsiveness) */}
        <LivingSlashPlane
          basePosition={[4.2, 1.0, -1.8]}
          baseRotation={[0.15, -0.1, -0.4]}
          scale={[3.2, 10.5, 1]}
          color="#8b5cf6"
          speed={reducedMotion ? 0.05 : 0.45}
          driftSpeed={0.38}
          rotationSpeed={0.22}
          parallaxFactor={0.7}
          phaseOffset={4.2}
        />

        {/* Plane 2: Main Front Slash */}
        <LivingSlashPlane
          basePosition={[1.8, 0.4, -2.0]}
          baseRotation={[0.1, -0.15, -0.42]}
          scale={[4.5, 14.0, 1]}
          color="#635bff"
          speed={reducedMotion ? 0.05 : 0.4}
          driftSpeed={0.32}
          rotationSpeed={0.2}
          parallaxFactor={0.45}
          phaseOffset={0.0}
        />

        {/* Plane 3: Midground Overlapping Electric Blue Slash */}
        <LivingSlashPlane
          basePosition={[3.2, -0.8, -3.0]}
          baseRotation={[0.05, -0.2, -0.38]}
          scale={[5.0, 16.0, 1]}
          color="#3b82f6"
          speed={reducedMotion ? 0.04 : 0.35}
          driftSpeed={0.26}
          rotationSpeed={0.16}
          parallaxFactor={0.35}
          phaseOffset={1.5}
        />

        {/* Plane 4: Background Cyan Slash */}
        <LivingSlashPlane
          basePosition={[0.5, 1.2, -4.2]}
          baseRotation={[-0.1, -0.1, -0.45]}
          scale={[3.8, 12.0, 1]}
          color="#06b6d4"
          speed={reducedMotion ? 0.03 : 0.28}
          driftSpeed={0.2}
          rotationSpeed={0.12}
          parallaxFactor={0.2}
          phaseOffset={3.0}
        />
      </Canvas>
    </div>
  );
}

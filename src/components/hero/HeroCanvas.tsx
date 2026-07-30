'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function MinimalRibbonMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float wave1 = sin(pos.x * 1.0 + uTime * 0.4) * 0.4;
          float wave2 = cos(pos.y * 1.5 + uTime * 0.3) * 0.3;
          
          pos.z += wave1 + wave2;
          vElevation = pos.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Stripe/Vercel silver & soft indigo mesh lighting
          vec3 baseWhite = vec3(0.98, 0.98, 1.0);
          vec3 softIndigo = vec3(0.39, 0.35, 1.0); // #635BFF accent
          vec3 silverGray = vec3(0.92, 0.93, 0.96);

          float mixFactor = smoothstep(-0.8, 0.8, vElevation);
          vec3 col = mix(silverGray, baseWhite, mixFactor);

          // Very subtle indigo sheen
          float sheen = sin(vUv.x * 3.1415 + uTime * 0.2) * 0.08 + 0.02;
          col += softIndigo * sheen;

          gl_FragColor = vec4(col, 0.45);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: true,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = time;
      meshRef.current.rotation.z = Math.sin(time * 0.05) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} scale={[14, 8, 1]}>
      <planeGeometry args={[1, 1, 48, 48]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

export default function HeroCanvas() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-white pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#635bff" />
        <MinimalRibbonMesh />
      </Canvas>
    </div>
  );
}

'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SatinRibbonMesh({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  scale = [1, 1, 1] as [number, number, number],
  speed = 0.25,
  phaseOffset = 0,
}) {
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
        varying vec3 vNormal;
        varying float vElevation;

        void main() {
          vUv = uv;
          vNormal = normal;
          vec3 pos = position;

          // Organic silk waves along diagonal parametric curve
          float wave1 = sin(pos.x * 0.7 + uTime * 0.4 + ${phaseOffset.toFixed(2)}) * 0.7;
          float wave2 = cos(pos.y * 0.9 + uTime * 0.3 + ${phaseOffset.toFixed(2)}) * 0.5;
          float wave3 = sin((pos.x + pos.y) * 0.4 + uTime * 0.25) * 0.3;

          // Gentle mouse parallax wave influence
          float mouseDist = distance(uv, uMouse);
          float mouseParallax = sin(mouseDist * 5.0 - uTime * 0.8) * 0.2 * (1.0 - smoothstep(0.0, 0.8, mouseDist));

          pos.z += wave1 + wave2 + wave3 + mouseParallax;
          vElevation = pos.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;

        void main() {
          // Color Palette: Warm Peach, Soft Coral, Magenta, Violet, Indigo, Soft Blue, White
          vec3 warmPeach  = vec3(1.0, 0.68, 0.52); // #ffad85
          vec3 softCoral  = vec3(1.0, 0.46, 0.54); // #ff758a
          vec3 magenta    = vec3(0.85, 0.30, 0.95); // #d94cf3
          vec3 indigo     = vec3(0.39, 0.35, 1.0);  // #635bff
          vec3 softBlue   = vec3(0.44, 0.63, 1.0);  // #70a1ff
          vec3 pureWhite  = vec3(0.99, 0.99, 1.0);

          // Flowing multi-stage gradient blending
          float mix1 = smoothstep(-1.2, 0.8, vElevation);
          float mix2 = sin(vUv.x * 3.1415 + uTime * 0.15) * 0.5 + 0.5;
          float mix3 = vUv.y;

          vec3 gradBase = mix(warmPeach, softCoral, mix1);
          vec3 gradMid  = mix(magenta, indigo, mix2);
          vec3 gradTop  = mix(softBlue, pureWhite, mix3 * 0.6);

          vec3 finalColor = mix(gradBase, gradMid, vUv.x * 0.7);
          finalColor = mix(finalColor, gradTop, vUv.y * 0.4);

          // Satin Subsurface Specular Sheen
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float specular = pow(rim, 3.5);
          finalColor += vec3(1.0, 0.95, 0.9) * specular * 0.5;

          // Translucent fabric opacity with smooth edge feathering
          float alphaEdge = sin(vUv.y * 3.1415);
          float opacity = 0.82 * smoothstep(0.0, 0.1, alphaEdge);

          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [phaseOffset]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = time * speed;
      shaderMaterial.uniforms.uMouse.value.set(
        state.pointer.x * 0.5 + 0.5,
        state.pointer.y * 0.5 + 0.5
      );
      // Gentle, continuous organic rotation
      meshRef.current.rotation.z = Math.sin(time * 0.03 + phaseOffset) * 0.06;
      meshRef.current.rotation.x = Math.cos(time * 0.02 + phaseOffset) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1, 96, 48]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

export default function HeroRibbons() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-white pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 10, 7]} intensity={0.7} color="#fff" />
        <pointLight position={[-8, -5, 5]} intensity={0.5} color="#ffad85" />
        <pointLight position={[8, -5, -3]} intensity={0.6} color="#635bff" />

        {/* Sculptural Translucent Satin Fabric Ribbons sweeping diagonally across viewport */}
        {/* Ribbon 1: Main sweeping diagonal top-right to center */}
        <SatinRibbonMesh
          position={[1.5, 0.5, -2.0]}
          rotation={[-0.2, 0.1, -0.45]}
          scale={[18, 5.5, 1]}
          speed={0.3}
          phaseOffset={0.0}
        />

        {/* Ribbon 2: Layered secondary ribbon below */}
        <SatinRibbonMesh
          position={[-0.8, -1.2, -3.2]}
          rotation={[0.1, -0.2, -0.35]}
          scale={[20, 6.0, 1]}
          speed={0.22}
          phaseOffset={1.8}
        />

        {/* Ribbon 3: Deep background satin flow */}
        <SatinRibbonMesh
          position={[2.5, -2.0, -4.5]}
          rotation={[-0.1, 0.3, -0.55]}
          scale={[22, 7.5, 1]}
          speed={0.18}
          phaseOffset={3.4}
        />
      </Canvas>
    </div>
  );
}

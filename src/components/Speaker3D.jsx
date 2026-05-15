import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ACCENT = '#c6f135';
const DARK = '#1a3a2a';
const METAL = '#2a4a3a';

function Model() {
  const meshRef = useRef();
  const ringRef = useRef();
  const ledRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
    }

    // Pulse the LED ring
    if (ledRef.current) {
      ledRef.current.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.6;
    }
  });

  return (
    <group scale={1.2}>
      {/* ── Main Speaker Body (Sleek Rounded Cylinder) ── */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 64]} />
        <meshStandardMaterial 
          color={DARK} 
          roughness={0.5} 
          metalness={0.4}
        />
        
        {/* Grille Detail (Inner mesh) */}
        <mesh scale={[1.01, 1, 1.01]}>
          <cylinderGeometry args={[0.5, 0.5, 1.2, 64]} />
          <meshStandardMaterial 
            color="#000000" 
            wireframe 
            transparent 
            opacity={0.15} 
          />
        </mesh>
      </mesh>

      {/* ── Top Interface ── */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.05, 64]} />
        <meshStandardMaterial color={METAL} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── Glowing LED Ring (Top) ── */}
      <mesh position={[0, 0.63, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.012, 16, 64]} />
        <meshStandardMaterial 
          ref={ledRef}
          color={ACCENT} 
          emissive={ACCENT} 
          emissiveIntensity={1.5} 
        />
      </mesh>

      {/* ── Media Buttons (Top) ── */}
      <group position={[0, 0.635, 0]}>
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[0.04, 3]} />
          <meshBasicMaterial color={ACCENT} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <circleGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[-0.12, 0, 0]}>
          <circleGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>

      {/* ── Bottom Stand ── */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.08, 64]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  );
}

export default function Speaker3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={2.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={3} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={2.5} color={ACCENT} />
        
        <Float 
          speed={2.5} 
          rotationIntensity={0.5} 
          floatIntensity={0.5}
        >
          <Model />
        </Float>

        <ContactShadows 
          position={[0, -1.1, 0]} 
          opacity={0.5} 
          scale={5} 
          blur={2.5} 
          far={1.5} 
          color={ACCENT}
        />
        
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/* ─── Procedural speaker mesh ─────────────────────────────────────────────── */
function SpeakerModel() {
  const groupRef = useRef();
  const ledMat = useRef();
  const coneRef = useRef();
  const startedAt = useRef(null);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (startedAt.current === null) startedAt.current = now;
    const t = now - startedAt.current;

    // ── Scale-in on mount (cubic ease-out over 1.2 s) ──
    const raw = Math.min(t / 1.2, 1);
    const eased = 1 - Math.pow(1 - raw, 3);

    // ── Breathing pulse (starts after entry finishes) ──
    const breathe = raw >= 1 ? Math.sin(t * 1.4) * 0.025 : 0;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(eased + breathe);
      // ── Float ──
      groupRef.current.position.y = raw >= 1 ? Math.sin(t * 0.75) * 0.13 : 0;
      // ── Slow Y rotation ──
      groupRef.current.rotation.y += 0.006;
    }

    // ── Speaker Cone "thump" effect ──
    if (coneRef.current && raw >= 1) {
      const beat = Math.sin(t * 8) * 0.015;
      coneRef.current.position.y = 0.65 + beat;
    }

    // ── LED ring glow pulse ──
    if (ledMat.current) {
      ledMat.current.emissiveIntensity = 0.8 + Math.sin(t * 2.8) * 0.5;
    }
  });

  const ACCENT = '#c6f135';
  const DARK = '#0a0a0a';
  const MID = '#1a1a1a';
  const CHROME = '#ffffff';

  return (
    <group ref={groupRef}>
      {/* ── Main body casing (Matte Dark) ── */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.76, 1.3, 64, 1]} />
        <meshStandardMaterial color={MID} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* ── Inner Acoustic Cone (Vibrates) ── */}
      <mesh ref={coneRef} position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.62, 0.2, 64]} />
        <meshStandardMaterial color={DARK} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── Center Driver Cap ── */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial color="#111" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ── Chrome details (Top Ring) ── */}
      <mesh position={[0, 0.76, 0]}>
        <torusGeometry args={[0.67, 0.03, 16, 64]} />
        <meshStandardMaterial color={CHROME} roughness={0.1} metalness={1} />
      </mesh>

      {/* ── Chrome details (Bottom Ring) ── */}
      <mesh position={[0, -0.66, 0]}>
        <torusGeometry args={[0.74, 0.02, 16, 64]} />
        <meshStandardMaterial color={CHROME} roughness={0.15} metalness={0.9} />
      </mesh>

      {/* ── Top interactive panel ── */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 64]} />
        <meshStandardMaterial color={DARK} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* ── LED accent ring ── */}
      <mesh position={[0, 0.84, 0]}>
        <torusGeometry args={[0.5, 0.015, 16, 64]} />
        <meshStandardMaterial
          ref={ledMat}
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1}
        />
      </mesh>

      {/* ── Media controls on top ── */}
      <mesh position={[0, 0.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.1, 3]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* ── Base ── */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.08, 64]} />
        <meshStandardMaterial color={DARK} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

/* ─── Exported Canvas scene ────────────────────────────────────────────────── */
export default function Speaker3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 4.5], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight
          position={[-10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
        />
        <SpeakerModel />
      </Suspense>
    </Canvas>
  );
}

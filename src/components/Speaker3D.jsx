import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/* ─── Procedural speaker mesh ─────────────────────────────────────────────── */
function SpeakerModel() {
  const groupRef  = useRef();
  const ledMat    = useRef();
  const startedAt = useRef(null);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (startedAt.current === null) startedAt.current = now;
    const t = now - startedAt.current;

    // ── Scale-in on mount (cubic ease-out over 1.2 s) ──
    const raw     = Math.min(t / 1.2, 1);
    const eased   = 1 - Math.pow(1 - raw, 3);

    // ── Breathing pulse (starts after entry finishes) ──
    const breathe = raw >= 1 ? Math.sin(t * 1.4) * 0.025 : 0;

    groupRef.current.scale.setScalar(eased + breathe);

    // ── Float ──
    groupRef.current.position.y = raw >= 1 ? Math.sin(t * 0.75) * 0.13 : 0;

    // ── Slow Y rotation ──
    groupRef.current.rotation.y += 0.006;

    // ── LED ring glow pulse ──
    if (ledMat.current) {
      ledMat.current.emissiveIntensity = 0.55 + Math.sin(t * 2.8) * 0.35;
    }
  });

  const ACCENT = '#c6f135';
  const DARK   = '#141414';
  const MID    = '#222222';
  const METAL  = '#0a0a0a';

  return (
    <group ref={groupRef} scale={0}>

      {/* ── Main body ── */}
      <mesh castShadow>
        <cylinderGeometry args={[0.64, 0.70, 1.52, 64, 1]} />
        <meshStandardMaterial color={MID} roughness={0.92} metalness={0.08} />
      </mesh>

      {/* ── Subtle band rings (detail) ── */}
      {[-0.45, 0, 0.45].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.695, 0.01, 8, 64]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* ── Top cap (metallic plate) ── */}
      <mesh position={[0, 0.77, 0]} castShadow>
        <cylinderGeometry args={[0.64, 0.64, 0.045, 64]} />
        <meshStandardMaterial color={DARK} roughness={0.25} metalness={0.85} />
      </mesh>

      {/* ── LED accent ring ── */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.46, 0.048, 20, 80]} />
        <meshStandardMaterial
          ref={ledMat}
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ── Center panel (dark disc) ── */}
      <mesh position={[0, 0.818, 0]}>
        <circleGeometry args={[0.22, 40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── Play-button triangle ── */}
      <mesh position={[0.025, 0.819, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.058, 0.095, 3]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.6} />
      </mesh>

      {/* ── 4 control dots around center ── */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.31, 0.82, Math.sin(angle) * 0.31]}>
          <cylinderGeometry args={[0.022, 0.022, 0.012, 12]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* ── Bottom edge ring ── */}
      <mesh position={[0, -0.77, 0]}>
        <torusGeometry args={[0.695, 0.018, 8, 64]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── Base ── */}
      <mesh position={[0, -0.82, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.54, 0.045, 64]} />
        <meshStandardMaterial color={METAL} roughness={0.18} metalness={0.92} />
      </mesh>

    </group>
  );
}

/* ─── Soft ground shadow plane ────────────────────────────────────────────── */
function ShadowPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow>
      <planeGeometry args={[6, 6]} />
      <shadowMaterial transparent opacity={0.35} />
    </mesh>
  );
}

/* ─── Exported Canvas scene ────────────────────────────────────────────────── */
export default function Speaker3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 3.8], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, -2, -4]} intensity={0.35} color="#c6f135" />
      <pointLight position={[0, 2.5, 1]} intensity={0.7} color="#c6f135" distance={6} decay={2} />
      <pointLight position={[3, 1, 3]} intensity={0.4} color="#ffffff" />

      {/* Model + shadow */}
      <SpeakerModel />
      <ShadowPlane />
    </Canvas>
  );
}

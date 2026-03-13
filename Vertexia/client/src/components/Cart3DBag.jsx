import { useRef, Suspense, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ─── colour pool ─────────────────────────────────────────────── */
const COLORS = ['#2563eb', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

/* ─── Gift box (product box with lid + ribbon) ────────────────── */
function GiftBox({ position, color, phase, speed }) {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.elapsedTime * speed + phase;
        groupRef.current.position.y = position[1] + Math.sin(t) * 0.15;
        groupRef.current.rotation.y += 0.01;
    });

    const mat = (col, roughness = 0.18, metalness = 0.05) => (
        <meshPhysicalMaterial color={col} roughness={roughness} metalness={metalness} clearcoat={0.8} clearcoatRoughness={0.1} />
    );

    const s = 0.48;
    const darken = (hex) => {
        // simple darken by blending with black
        const c = new THREE.Color(hex);
        c.multiplyScalar(0.6);
        return `#${c.getHexString()}`;
    };

    return (
        <group ref={groupRef} position={position}>
            {/* Box body */}
            <mesh castShadow>
                <boxGeometry args={[s, s * 0.85, s]} />
                {mat(color)}
            </mesh>
            {/* Lid (slightly larger, sits on top) */}
            <mesh castShadow position={[0, s * 0.48, 0]}>
                <boxGeometry args={[s + 0.04, s * 0.18, s + 0.04]} />
                {mat(darken(color), 0.12, 0.1)}
            </mesh>
            {/* Ribbon horizontal */}
            <mesh position={[0, s * 0.01, 0]}>
                <boxGeometry args={[s + 0.02, s * 0.85 + 0.02, 0.06]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.2} opacity={0.7} transparent clearcoat={1} />
            </mesh>
            {/* Ribbon vertical */}
            <mesh position={[0, s * 0.01, 0]}>
                <boxGeometry args={[0.06, s * 0.85 + 0.02, s + 0.02]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.2} opacity={0.7} transparent clearcoat={1} />
            </mesh>
            {/* Bow top loop left */}
            <mesh position={[-0.1, s * 0.58, 0]} rotation={[0, 0, Math.PI / 5]}>
                <torusGeometry args={[0.1, 0.025, 8, 20, Math.PI]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.1} clearcoat={1} />
            </mesh>
            {/* Bow top loop right */}
            <mesh position={[0.1, s * 0.58, 0]} rotation={[0, 0, -Math.PI / 5]}>
                <torusGeometry args={[0.1, 0.025, 8, 20, Math.PI]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.1} clearcoat={1} />
            </mesh>
        </group>
    );
}

/* ─── Premium shopping bag shell ────────────────────────────── */
function BagShell() {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        // gentle idle bob only (user controls rotation via OrbitControls)
        groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.04;
    });

    const bagMat = (
        <meshPhysicalMaterial
            color="#0f2d5e"
            roughness={0.08}
            metalness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.04}
        />
    );

    return (
        <group ref={groupRef} position={[0, -0.55, 0]}>
            {/* ── Bag walls (FrontSide only so inside never shows) ── */}
            {/* Floor */}
            <mesh receiveShadow position={[0, -1.2, 0]}>
                <boxGeometry args={[2.9, 0.12, 2.1]} />
                {bagMat}
            </mesh>
            {/* Left wall */}
            <mesh castShadow position={[-1.45, 0, 0]}>
                <boxGeometry args={[0.12, 2.52, 2.1]} />
                {bagMat}
            </mesh>
            {/* Right wall */}
            <mesh castShadow position={[1.45, 0, 0]}>
                <boxGeometry args={[0.12, 2.52, 2.1]} />
                {bagMat}
            </mesh>
            {/* Back wall */}
            <mesh castShadow position={[0, 0, -1.05]}>
                <boxGeometry args={[2.9, 2.52, 0.12]} />
                {bagMat}
            </mesh>

            {/* ── Top rim (bright blue accent) ── */}
            <mesh position={[0, 1.26, 0]}>
                <boxGeometry args={[2.96, 0.1, 2.16]} />
                <meshPhysicalMaterial color="#2563eb" roughness={0.04} metalness={0.4} clearcoat={1} />
            </mesh>

            {/* ── Logo plate on front face ── */}
            <mesh position={[0, 0.1, 1.05]}>
                <boxGeometry args={[1.1, 0.32, 0.02]} />
                <meshPhysicalMaterial color="#1d4ed8" roughness={0.05} metalness={0.6} clearcoat={1} />
            </mesh>

            {/* ── Rope handles ── */}
            {[-0.65, 0.65].map((x, i) => (
                <group key={i}>
                    {/* Arc */}
                    <mesh position={[x, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.38, 0.055, 14, 40, Math.PI]} />
                        <meshPhysicalMaterial color="#60a5fa" roughness={0.08} metalness={0.5} clearcoat={1} />
                    </mesh>
                    {/* Attachment pegs */}
                    {[-0.15, 0.15].map((z, j) => (
                        <mesh key={j} position={[x, 1.28, z]}>
                            <cylinderGeometry args={[0.042, 0.042, 0.2, 12]} />
                            <meshStandardMaterial color="#93c5fd" roughness={0.15} metalness={0.7} />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* ── Ground reflection plane ── */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.26, 0]}>
                <planeGeometry args={[6, 5]} />
                <meshBasicMaterial color="#1d4ed8" transparent opacity={0.055} />
            </mesh>
        </group>
    );
}

/* ─── Scene ─────────────────────────────────────────────────── */
function BagScene({ items }) {
    const boxes = useMemo(() => {
        const list = [];
        let ci = 0;
        items.forEach(item => {
            const n = Math.min(item.quantity, 3);
            for (let i = 0; i < n && list.length < 9; i++) {
                const col = ci % 3;
                const row = Math.floor(list.length / 3);
                list.push({
                    id: `${item.id}-${i}`,
                    color: COLORS[ci % COLORS.length],
                    position: [(col - 1) * 0.72, -0.65 + row * 0.75, (Math.random() - 0.5) * 0.4],
                    phase: ci * 1.45,
                    speed: 0.55 + (ci % 3) * 0.15,
                });
                ci++;
            }
        });
        return list;
    }, [items]);

    return (
        <>
            <BagShell />
            {boxes.map(b => (
                <GiftBox key={b.id} position={b.position} color={b.color} phase={b.phase} speed={b.speed} />
            ))}
        </>
    );
}

/* ─── Export ─────────────────────────────────────────────────── */
export default function Cart3DBag({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div
            className="w-full h-[280px] sm:h-[360px] rounded-3xl overflow-hidden border border-blue-900/40 relative cursor-grab active:cursor-grabbing group"
            style={{ background: 'radial-gradient(ellipse at 45% 40%, #0d1f45 0%, #020617 70%)' }}
        >
            <Canvas
                camera={{ position: [0, 1.2, 7.5], fov: 38 }}
                dpr={[1, 1.5]}
                shadows
                gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
                {/* Lighting setup */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
                <pointLight position={[-4, 4, 4]} intensity={1.6} color="#3b82f6" />
                <pointLight position={[4, -2, -3]} intensity={0.8} color="#818cf8" />
                <pointLight position={[0, -2, 5]} intensity={0.5} color="#38bdf8" />

                {/* Safe drag-to-rotate: azimuth ±70° keeps back wall always hidden */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minAzimuthAngle={-Math.PI * 0.38}
                    maxAzimuthAngle={Math.PI * 0.38}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.1}
                    rotateSpeed={0.6}
                    dampingFactor={0.08}
                    enableDamping
                />

                <Suspense fallback={null}>
                    <BagScene items={items} />
                </Suspense>
            </Canvas>

            {/* Item count badge */}
            <div className="absolute top-3 left-3 pointer-events-none">
                <span className="bg-black/50 backdrop-blur-md text-white/80 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                    🛍 {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} in bag
                </span>
            </div>

            {/* Drag hint — fades out on hover */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                <span className="bg-black/50 backdrop-blur-md text-white/60 text-[10px] font-bold px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                    ↔ Drag to spin
                </span>
            </div>
        </div>
    );
}

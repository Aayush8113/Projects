import { useEffect, useState, useRef, Suspense } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Lightweight shopping bag — zero expensive shaders ───────────────────────
const ShoppingBagScene = () => {
    const groupRef = useRef();
    const ring1 = useRef();
    const ring2 = useRef();
    const gem1 = useRef();
    const gem2 = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (groupRef.current) {
            groupRef.current.rotation.y += 0.012;
            groupRef.current.position.y = Math.sin(t * 1.8) * 0.12;
        }
        if (ring1.current) ring1.current.rotation.z += 0.018;
        if (ring2.current) ring2.current.rotation.x += 0.022;
        if (gem1.current) {
            gem1.current.rotation.x += 0.025;
            gem1.current.position.y = Math.sin(t * 2.5) * 0.28 + 0.5;
        }
        if (gem2.current) {
            gem2.current.rotation.z += 0.03;
            gem2.current.position.x = Math.cos(t * 2) * 0.45 - 0.5;
        }
    });

    return (
        <group ref={groupRef} scale={1.15}>
            {/* ── Bag body ── glossy physical material, no transmission */}
            <mesh position={[0, -0.2, 0]} castShadow>
                <boxGeometry args={[1.6, 2.2, 0.8]} />
                <meshPhysicalMaterial
                    color="#1e40af"
                    roughness={0.08}
                    metalness={0.1}
                    clearcoat={1}
                    clearcoatRoughness={0.05}
                    reflectivity={0.8}
                />
            </mesh>

            {/* ── Inner product peek ── */}
            <mesh position={[0, 0.45, 0.05]}>
                <boxGeometry args={[1.1, 0.55, 0.55]} />
                <meshStandardMaterial color="#e0f2fe" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* ── Bag handle front ── */}
            <mesh position={[0, 1.12, 0.22]}>
                <torusGeometry args={[0.34, 0.055, 16, 32, Math.PI]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.2} metalness={0.6} clearcoat={1} />
            </mesh>

            {/* ── Bag handle back ── */}
            <mesh position={[0, 1.12, -0.22]}>
                <torusGeometry args={[0.34, 0.055, 16, 32, Math.PI]} />
                <meshPhysicalMaterial color="#ffffff" roughness={0.2} metalness={0.6} clearcoat={1} />
            </mesh>

            {/* ── Glowing orbit rings ── cheap emissive, no HDR needed */}
            <mesh ref={ring1} position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.55, 0.012, 12, 64]} />
                <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={1.2} />
            </mesh>
            <mesh ref={ring2} position={[0, -0.2, 0]} rotation={[Math.PI / 2.4, 0.3, 0]}>
                <torusGeometry args={[1.2, 0.012, 12, 64]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
            </mesh>

            {/* ── Floating gems ── simple geometry, cheap material */}
            <group ref={gem1} position={[0, 0, 0]}>
                <mesh position={[1.0, 0.5, 0.4]}>
                    <octahedronGeometry args={[0.22, 0]} />
                    <meshPhysicalMaterial color="#7dd3fc" roughness={0.05} metalness={0.3} clearcoat={1} />
                </mesh>
            </group>
            <group ref={gem2} position={[0, 0, 0]}>
                <mesh position={[-1.0, -0.5, 0.4]}>
                    <icosahedronGeometry args={[0.18, 0]} />
                    <meshStandardMaterial color="#f43f5e" roughness={0.15} metalness={0.9} />
                </mesh>
            </group>
        </group>
    );
};

// ─── Module-level flag: only show loader once per full page refresh ───────────
let _loaderHasShown = false;

const GlobalLoader = () => {
    const [isLoading, setIsLoading] = useState(!_loaderHasShown);

    useEffect(() => {
        if (_loaderHasShown) return;
        const timer = setTimeout(() => {
            setIsLoading(false);
            _loaderHasShown = true;
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden cursor-none"
                >
                    {/* Radial dark backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(49,46,129,0.2)_0%,rgba(2,6,23,1)_100%)]" />

                    {/* 3D Canvas — lightweight, no HDR/ContactShadows */}
                    <div className="absolute inset-0 w-full h-full">
                        <Canvas
                            camera={{ position: [0, 0, 5], fov: 45 }}
                            dpr={[1, 1.5]}
                            gl={{ antialias: true, powerPreference: 'high-performance' }}
                        >
                            {/* Manual lights — no env map fetch */}
                            <ambientLight intensity={0.6} />
                            <pointLight position={[4, 6, 4]} intensity={2.5} color="#ffffff" />
                            <pointLight position={[-4, -2, 3]} intensity={1.2} color="#3b82f6" />
                            <pointLight position={[0, -4, -2]} intensity={0.8} color="#818cf8" />

                            <Suspense fallback={null}>
                                <ShoppingBagScene />
                            </Suspense>
                        </Canvas>
                    </div>

                    {/* Text overlay */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none"
                    >
                        <div className="mt-64 flex flex-col items-center">
                            <motion.h2
                                initial={{ letterSpacing: '0.5em' }}
                                animate={{ letterSpacing: '0.2em' }}
                                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                                className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4"
                            >
                                Vertexia
                            </motion.h2>
                            <p className="text-blue-200/60 font-medium tracking-[0.3em] text-xs uppercase">
                                Preparing Experience
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { ProceduralLaptop, ProceduralPhone, ProceduralShirt, ProceduralBottle, ProceduralMug, ProceduralBook } from './ProductModels';
import RealisticShoe from './RealisticShoe';

// Hotspot Component
const Hotspot = ({ position, title, description }) => {
    const [open, setOpen] = useState(false);

    return (
        <Html position={position} center zIndexRange={[100, 0]}>
            <div className="relative group">
                <button
                    onClick={() => setOpen(!open)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/20 shadow-xl ${open ? 'bg-blue-600 rotate-45' : 'bg-slate-900/60 hover:bg-slate-800'}`}
                >
                    <Plus size={16} />
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 pointer-events-none"
                        >
                            <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1 uppercase tracking-wider">{title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 dark:bg-slate-900/90 border-b border-r border-slate-200/50 dark:border-slate-700/50 rotate-45 transform pointer-events-none" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Html>
    );
};

const ModelSelector = ({ product, selectedColor }) => {
    if (!product) return null;

    const c = product.category ? product.category.toLowerCase() : '';
    const t = product.title ? product.title.toLowerCase() : '';

    // Exact title checks first
    if (t.includes('shoe') || t.includes('sneaker') || t.includes('boot')) return <RealisticShoe color={selectedColor} scale={2.5} />;
    if (t.includes('laptop') || t.includes('mac') || t.includes('pc')) return <ProceduralLaptop color={selectedColor} scale={0.4} />;
    if (t.includes('phone') || t.includes('mobile')) return <ProceduralPhone color={selectedColor} scale={0.8} />;
    if (t.includes('shirt') || t.includes('apparel') || t.includes('clothing')) return <ProceduralShirt color={selectedColor} scale={1.2} />;
    if (t.includes('top') || t.includes('elegant')) return <ProceduralShirt color={selectedColor} scale={1.2} />;
    if (t.includes('cream') || t.includes('lotion') || t.includes('serum')) return <ProceduralBottle color={selectedColor} scale={1.2} />;

    // Category checks
    const isElec = c.includes('electronics') || c.includes('gadgets');
    const isFash = c.includes('fashion') || c.includes('apparel');

    if (isElec) {
        return <ProceduralLaptop color={selectedColor} scale={0.4} />;
    } else if (isFash) {
        return <ProceduralShirt color={selectedColor} scale={1.2} />;
    } else if (c.includes('health') || c.includes('beauty') || c.includes('care')) {
        return <ProceduralBottle color={selectedColor} scale={1.2} />;
    } else if (c.includes('home') || c.includes('kitchen') || c.includes('groceries') || c.includes('furniture')) {
        return <ProceduralMug color={selectedColor} scale={1.5} />;
    } else if (c.includes('toys') || c.includes('books') || c.includes('hobbies')) {
        return <ProceduralBook color={selectedColor} scale={1.5} />;
    }

    // Universal Ultimate Fallback
    return <ProceduralMug color={selectedColor} scale={1.5} />;
};

const ShowcaseBox = () => {
    return (
        <group position={[0, -0.6, 0]}>
            {/* Base Platform */}
            <mesh position={[0, -0.05, 0]} receiveShadow>
                <boxGeometry args={[4, 0.1, 4]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Glass Box (Showcase) */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[4.2, 3.2, 4.2]} />
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.1}
                    chromaticAberration={0.02}
                    anisotropy={0.1}
                    distortion={0}
                    distortionScale={0}
                    temporalDistortion={0}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#ffffff"
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Box Edges (Frame) */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[4.22, 3.22, 4.22]} />
                <meshBasicMaterial color="#3b82f6" wireframe opacity={0.1} transparent />
            </mesh>

            {/* Internal Floor Glow */}
            <pointLight position={[0, 0.1, 0]} intensity={1.5} color="#3b82f6" distance={3} />
        </group>
    );
};

const ConfiguratorGroup = ({ product, selectedColor }) => {
    return (
        <group scale={1.2} position={[0, -1.2, 0]}>
            <ShowcaseBox />

            <group position={[0, 1.2, 0]} scale={1.5}>
                <ModelSelector product={product} selectedColor={selectedColor} />
            </group>

            {/* General Hotspots */}
            <Hotspot position={[0, 1.6, 0.8]} title="Premium Materials" description="Constructed from the highest quality, sustainably sourced materials for maximum durability." />
            <Hotspot position={[0.8, 1.1, 0]} title="Ergonomic Design" description="Engineered perfectly for everyday use with comfort and utility in mind." />
            <Hotspot position={[-0.8, 1.4, -0.6]} title="Precision Finish" description="Flawless attention to detail with microscopic accuracy on all seams and joints." />
        </group>
    );
};

export default function ProductWorkbench({ product, selectedColor = '#0f172a' }) {
    const [isAROpen, setIsAROpen] = useState(false);
    // Determine lighting based on light/dark mode for the 3D scene
    const isDarkMode = document.documentElement.classList.contains('dark');

    return (
        <div
            className="w-full h-full min-h-[400px] lg:min-h-[600px] relative touch-none cursor-grab active:cursor-grabbing rounded-[2.5rem] overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse 90% 80% at 50% 40%, #0d1a3a 0%, #080d1e 55%, #020617 100%)',
                boxShadow: 'inset 0 0 80px rgba(59,130,246,0.06)',
            }}
        >
            {/* Ambient CSS glow orbs — no JS overhead */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Top-left electric blue orb */}
                <div style={{
                    position: 'absolute', top: '-10%', left: '-8%',
                    width: '350px', height: '350px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                }} />
                {/* Bottom-right violet orb */}
                <div style={{
                    position: 'absolute', bottom: '-5%', right: '-8%',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
                    filter: 'blur(45px)',
                }} />
                {/* Center ambient cyan glow */}
                <div style={{
                    position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)',
                    width: '280px', height: '200px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />
                {/* Dot grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(148,163,184,0.055) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
                {/* Top shine reflection */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
                }} />
                {/* Bottom reflection */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)',
                }} />
            </div>

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} shadows style={{ background: 'transparent' }} gl={{ alpha: true }}>
                <ambientLight intensity={isDarkMode ? 0.5 : 0.8} />
                <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} castShadow shadow-mapSize={[1024, 1024]} color="#ffffff" />
                <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#818cf8" />
                <directionalLight position={[5, -2, 5]} intensity={0.3} color="#22d3ee" />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={3}
                    maxDistance={15}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 4}
                    makeDefault
                />
                <React.Suspense fallback={null}>
                    <ConfiguratorGroup product={product} selectedColor={selectedColor} />
                </React.Suspense>

                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={3} far={4} color="#3b82f6" />
                <Environment preset="studio" />
            </Canvas>

            {/* Instruction overlay */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10">
                <span className="text-xs font-bold text-slate-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm uppercase tracking-widest">
                    Drag to rotate • Scroll to zoom
                </span>
            </div>

            {/* AR Quick Look Button */}
            <div className="absolute top-6 right-6 z-10">
                <button onClick={() => setIsAROpen(true)} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold flex items-center hover:bg-white dark:hover:bg-slate-700 transition-colors pointer-events-auto active:scale-95">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8V6a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2M7 20H5a2 2 0 01-2-2v-2" /><circle cx="12" cy="12" r="3" /></svg>
                    View in AR
                </button>
            </div>

            {/* AR Fullscreen Overlay */}
            <AnimatePresence>
                {isAROpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] bg-white/95 dark:bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center touch-none overflow-hidden overscroll-none"
                    >
                        <button onClick={() => setIsAROpen(false)} className="absolute top-8 right-8 z-[110] p-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl">
                            <X size={28} />
                        </button>

                        <div className="absolute top-8 left-8 z-[110] bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
                                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3" /> Live AR View
                            </h3>
                        </div>

                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} shadows className="w-full h-full cursor-grab active:cursor-grabbing">
                            <ambientLight intensity={isDarkMode ? 0.3 : 0.6} />
                            <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
                            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                            <OrbitControls
                                enablePan={false}
                                enableZoom={true}
                                minDistance={2}
                                maxDistance={15}
                                autoRotate
                                autoRotateSpeed={1.5}
                            />
                            <React.Suspense fallback={null}>
                                <group scale={3.5} position={[0, -1, 0]}>
                                    <ModelSelector product={product} selectedColor={selectedColor} />
                                </group>
                            </React.Suspense>
                            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={30} blur={2.5} far={4} color="#000000" />
                            <Environment preset={isDarkMode ? 'night' : 'city'} />
                        </Canvas>

                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-[110]">
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 px-6 py-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-xl uppercase tracking-widest">
                                Pinch to Zoom • Drag to Rotate
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

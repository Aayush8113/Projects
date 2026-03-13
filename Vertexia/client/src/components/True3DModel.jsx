import React, { useRef, useState } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { Center, Float, PresentationControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RealisticShoe from './RealisticShoe';
import ErrorBoundary from './ErrorBoundary';

gsap.registerPlugin(ScrollTrigger);

import { ProceduralLaptop, ProceduralPhone, ProceduralSmartSpeaker } from './ProductModels';


const ShowcaseBox = ({ isSelected }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += 0.01;
        meshRef.current.opacity = THREE.MathUtils.lerp(meshRef.current.opacity || 0, isSelected ? 0.15 : 0, 0.1);
    });

    return (
        <mesh ref={meshRef} visible={isSelected}>
            <boxGeometry args={[4, 4, 4]} />
            <meshPhysicalMaterial
                transparent
                opacity={0}
                color="#6366f1"
                roughness={0}
                metalness={0.1}
                transmission={0.5}
                thickness={0.5}
                side={THREE.DoubleSide}
            />
            <mesh position={[0, -2, 0]}>
                <boxGeometry args={[4.2, 0.1, 4.2]} />
                <meshPhysicalMaterial color="#1e1b4b" metalness={0.8} roughness={0.2} />
            </mesh>
        </mesh>
    );
};

const ShoppingBag = (props) => (
    <group {...props}>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 2, 0.8]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.9} clearcoat={0.1} />
        </mesh>
        <mesh position={[0, 0.5, 0.41]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[-0.4, 1.7, 0]}>
            <torusGeometry args={[0.3, 0.03, 16, 32, Math.PI]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.5} />
        </mesh>
        <mesh position={[0.4, 1.7, 0]}>
            <torusGeometry args={[0.3, 0.03, 16, 32, Math.PI]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.5} />
        </mesh>
    </group>
);
const InteractiveItem = ({ children, position, scale, isSelected, onClick, defaultPos, angle, radius }) => {
    const ref = useRef();

    useFrame(() => {
        if (!ref.current) return;

        // Push it outward and towards camera dynamically based on radius
        // Reduced from 2.5 to 1.5 to prevent clipping
        const targetRadius = isSelected ? radius + 1.5 : radius;
        const targetPos = new THREE.Vector3(Math.sin(angle) * targetRadius, 0, Math.cos(angle) * targetRadius);

        // Reduced scale multiplier from 1.8x to 1.45x to safely avoid clipping
        const targetScale = isSelected ? scale * 1.45 : scale;

        ref.current.position.lerp(targetPos, 0.08);
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

        // Slightly rotate the item towards camera if selected
        if (isSelected) {
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.08);
        }
    });

    return (
        <group ref={ref} position={position} scale={scale} onClick={onClick}>
            <ShowcaseBox isSelected={isSelected} />
            <Float speed={2} rotationIntensity={isSelected ? 0.1 : 0.2} floatIntensity={isSelected ? 0.2 : 0.5}>
                {children}
            </Float>
        </group>
    );
};

const InteractiveCollection = () => {
    const revolveRef = useRef();
    const [selectedId, setSelectedId] = useState(null);
    const { viewport } = useThree();

    // Scale down the entire setup on mobile screens precisely
    const globalScale = Math.min(1, viewport.width / 5.5);

    useFrame((state, delta) => {
        if (!revolveRef.current) return;

        if (selectedId === null) {
            // Revolving 360 continuously
            revolveRef.current.rotation.y += delta * 0.3;
        } else {
            // Find the selected item's angle and rotate the carousel to face it
            const selectedItemIndex = items.findIndex(i => i.id === selectedId);
            if (selectedItemIndex !== -1) {
                const angle = (selectedItemIndex / items.length) * Math.PI * 2;
                let targetRot = -angle;
                let currentRot = revolveRef.current.rotation.y;
                // Take shortest rotation path
                while (currentRot - targetRot > Math.PI) targetRot += Math.PI * 2;
                while (targetRot - currentRot > Math.PI) targetRot -= Math.PI * 2;

                revolveRef.current.rotation.y = THREE.MathUtils.lerp(revolveRef.current.rotation.y, targetRot, 0.06);
            }
        }
    });

    const handleItemClick = (e, id) => {
        e.stopPropagation();
        setSelectedId(id === selectedId ? null : id);
    };

    const isMobile = viewport.width < 5;
    const radius = isMobile ? 2.5 : 3.5;
    const items = [
        { id: 'shoe', Component: RealisticShoe, scale: 0.75, rot: [0, 0, 0] }, // Reduced from 0.9 to 0.75 for boot safety
        { id: 'laptop', Component: ProceduralLaptop, scale: 0.28, rot: [0.1, 0, 0] },
        { id: 'phone', Component: ProceduralPhone, scale: 0.45, rot: [0.1, 0, 0] },
        { id: 'bag', Component: ShoppingBag, scale: 0.75, rot: [0, 0, 0] },
        { id: 'speaker', Component: ProceduralSmartSpeaker, scale: 0.6, rot: [0, 0, 0] }
    ];

    return (
        <group scale={globalScale} position={[0, -0.5, 0]} onClick={() => setSelectedId(null)}>
            <Center>
                <group ref={revolveRef}>
                    {items.map((item, index) => {
                        const angle = (index / items.length) * Math.PI * 2;
                        const x = Math.sin(angle) * radius;
                        const z = Math.cos(angle) * radius;

                        // Give them a base rotation to face outward/inward natively on the carousel
                        const baseRotation = [item.rot[0], item.rot[1] + angle, item.rot[2]];

                        return (
                            <InteractiveItem
                                key={item.id}
                                defaultPos={[x, 0, z]}
                                position={[x, 0, z]}
                                scale={item.scale}
                                isSelected={selectedId === item.id}
                                onClick={(e) => handleItemClick(e, item.id)}
                                angle={angle}
                                radius={radius}
                            >
                                <item.Component rotation={baseRotation} />
                            </InteractiveItem>
                        );
                    })}
                </group>
            </Center>
        </group>
    );
};

const True3DModel = () => {
    return (
        <div
            id="hero-3d-container"
            className="w-full h-[500px] md:h-[600px] lg:h-[800px] cursor-pointer relative z-20 overflow-visible rounded-[2.5rem]"
            style={{
                background: 'radial-gradient(ellipse 80% 70% at 55% 50%, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
            }}
        >
            {/* Ambient glow orbs - CSS only, zero JS overhead */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
                {/* Top-right violet orb */}
                <div style={{
                    position: 'absolute', top: '-5%', right: '10%',
                    width: '420px', height: '420px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />
                {/* Center-bottom cyan orb */}
                <div style={{
                    position: 'absolute', bottom: '0%', left: '20%',
                    width: '360px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                }} />
                {/* Left blue orb */}
                <div style={{
                    position: 'absolute', top: '30%', left: '-5%',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)',
                    filter: 'blur(45px)',
                }} />
                {/* Subtle dot grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(148,163,184,0.06) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />
                {/* Bottom fade-into-page gradient */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
                    background: 'linear-gradient(to bottom, transparent, #020617)',
                }} />
            </div>

            <ErrorBoundary>
                {/* Fixed touchAction none to remove use-gesture warnings and handle touch natively */}
                <Canvas style={{ touchAction: 'none', background: 'transparent' }} camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}>
                    <ambientLight intensity={0.6} />
                    <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={1.4} castShadow />
                    <directionalLight position={[-10, 5, 5]} intensity={0.7} color="#818cf8" />
                    <directionalLight position={[8, -4, 8]} intensity={0.3} color="#22d3ee" />

                    <PresentationControls
                        global={true}
                        cursor={false}
                        snap={true}
                        speed={1.5}
                        zoom={1}
                        rotation={[0, 0, 0]}
                        polar={[-Math.PI / 8, Math.PI / 8]}
                        azimuth={[-Infinity, Infinity]}
                    >
                        <React.Suspense fallback={null}>
                            <InteractiveCollection />
                        </React.Suspense>
                    </PresentationControls>

                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={25} blur={3} far={4} color="#4f46e5" />
                    <Environment preset="studio" />
                </Canvas>
            </ErrorBoundary>

            {/* "3D Showcase" label */}
            <div className="absolute top-5 left-6 pointer-events-none z-10">
                <span className="text-[10px] font-black text-indigo-300/70 uppercase tracking-[0.2em] bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    ✦ Interactive 3D Showcase
                </span>
            </div>
        </div>
    );
};

export default True3DModel;

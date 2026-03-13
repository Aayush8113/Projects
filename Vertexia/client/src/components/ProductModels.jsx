import * as THREE from 'three';
import { RoundedBox, Box, Cylinder, Sphere, MeshTransmissionMaterial } from '@react-three/drei';
import RealisticShoe from './RealisticShoe';

// 1. ELECTRONICS: iPhone Pro - High Fidelity
export const ProceduralPhone = ({ color = '#0f172a', scale = 1.5, ...props }) => {
    const chassisMat = new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.9, roughness: 0.2 });
    const screenMat = new THREE.MeshPhysicalMaterial({ color: '#050505', metalness: 0.1, roughness: 0.05, clearcoat: 1 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: '#000', metalness: 1, roughness: 0, clearcoat: 1 });

    return (
        <group scale={scale} dispose={null} {...props}>
            {/* Main Chassis */}
            <RoundedBox args={[1.5, 3.1, 0.15]} radius={0.1} smoothness={4} castShadow receiveShadow>
                <primitive object={chassisMat} attach="material" />
            </RoundedBox>

            {/* Screen Glass */}
            <RoundedBox args={[1.46, 3.06, 0.16]} radius={0.09} smoothness={4} position={[0, 0, 0.002]}>
                <primitive object={screenMat} attach="material" />
            </RoundedBox>

            {/* Status Bar / Dynamic Island */}
            <RoundedBox args={[0.5, 0.12, 0.17]} radius={0.06} smoothness={4} position={[0, 1.4, 0.005]}>
                <primitive object={lensMat} attach="material" />
            </RoundedBox>

            {/* Camera Bump */}
            <RoundedBox args={[0.65, 0.65, 0.05]} radius={0.15} position={[-0.35, 1.1, -0.08]} castShadow>
                <primitive object={chassisMat} attach="material" />
            </RoundedBox>

            {/* Lenses */}
            <Cylinder args={[0.12, 0.12, 0.05, 32]} position={[-0.45, 1.25, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <primitive object={lensMat} attach="material" />
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.05, 32]} position={[-0.25, 0.95, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <primitive object={lensMat} attach="material" />
            </Cylinder>
            <Cylinder args={[0.08, 0.08, 0.05, 32]} position={[-0.45, 0.95, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
            </Cylinder>

            {/* Apple-like Logo (Apple is a circle for procedural sim) */}
            <Cylinder args={[0.15, 0.15, 0.2, 32]} position={[0, 0.2, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
            </Cylinder>
        </group>
    );
};

// 2. ELECTRONICS: Laptop - HIGH DETAIL PROCEDURAL MODEL
export const ProceduralLaptop = ({ color = '#e5e7eb', scale = 1.2, ...props }) => {
    // Hyper realistic materials
    const chassisMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.1,
    });

    const screenGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: '#020202',
        metalness: 0.1,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
    });

    const keyboardMaterial = new THREE.MeshStandardMaterial({
        color: '#111111',
        roughness: 0.7,
        metalness: 0.3
    });

    return (
        <group scale={scale} position={[0, -0.5, 0]} {...props}>
            {/* Base / Lower Chassis */}
            <RoundedBox args={[3.2, 0.15, 2.2]} radius={0.02} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
                <primitive object={chassisMaterial} attach="material" />
            </RoundedBox>

            {/* Keyboard Deck Recess */}
            <RoundedBox args={[2.8, 0.16, 1.1]} radius={0.01} smoothness={4} position={[0, 0.005, -0.3]}>
                <primitive object={chassisMaterial} attach="material" />
            </RoundedBox>

            {/* Keyboard Area (representing individual keys via texture or solid block for now) */}
            <Box args={[2.7, 0.02, 1.0]} position={[0, 0.08, -0.3]}>
                <primitive object={keyboardMaterial} attach="material" />
            </Box>

            {/* Trackpad */}
            <RoundedBox args={[1.2, 0.02, 0.7]} radius={0.01} smoothness={4} position={[0, 0.08, 0.6]}>
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
            </RoundedBox>

            {/* Speaker Grills (Left and Right) */}
            <Box args={[0.3, 0.04, 1.0]} position={[-1.5, 0.08, -0.3]}>
                <meshStandardMaterial color="#333" roughness={0.8} />
            </Box>
            <Box args={[0.3, 0.04, 1.0]} position={[1.5, 0.08, -0.3]}>
                <meshStandardMaterial color="#333" roughness={0.8} />
            </Box>

            {/* Screen Lid (Opened) */}
            <group position={[0, 0.05, -1.05]} rotation={[0.3, 0, 0]}>
                <RoundedBox args={[3.2, 2.2, 0.08]} radius={0.02} smoothness={4} position={[0, 1.1, -0.04]} castShadow>
                    <primitive object={chassisMaterial} attach="material" />
                </RoundedBox>

                {/* Screen Bezel (Black Glass) */}
                <RoundedBox args={[3.15, 2.15, 0.02]} radius={0.02} smoothness={4} position={[0, 1.1, 0.01]}>
                    <primitive object={screenGlassMaterial} attach="material" />
                </RoundedBox>

                {/* Actual Display Area with a default background */}
                <Box args={[3.0, 1.9, 0.01]} position={[0, 1.1, 0.025]}>
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.6} roughness={0.1} />
                </Box>

                {/* Webcam */}
                <Sphere args={[0.015, 16, 16]} position={[0, 2.1, 0.025]}>
                    <meshBasicMaterial color="#00ff00" />
                </Sphere>

                {/* Logo on Back Lid */}
                <Cylinder args={[0.2, 0.2, 0.09, 32]} position={[0, 1.1, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} emissive="#fff" emissiveIntensity={0.8} />
                </Cylinder>
            </group>
        </group>
    );
};

// 3. BEAUTY: Cosmetics Bottle
export const ProceduralBottle = ({ color = '#ec4899', scale = 1.8, ...props }) => {
    return (
        <group scale={scale} position={[0, -1, 0]} {...props}>
            {/* Glass Body */}
            <Cylinder args={[0.6, 0.6, 1.5, 64]} position={[0, 0.75, 0]} castShadow receiveShadow>
                <MeshTransmissionMaterial
                    backside
                    thickness={0.5}
                    chromaticAberration={0.03}
                    ior={1.5}
                    clearcoat={1}
                    color={color}
                    transparent
                    opacity={0.9}
                />
            </Cylinder>
            {/* Inner Liquid (Solid) */}
            <Cylinder args={[0.5, 0.5, 1.3, 32]} position={[0, 0.7, 0]}>
                <meshStandardMaterial color={color} metalness={0.1} roughness={0.3} />
            </Cylinder>
            {/* Metallic Cap */}
            <Cylinder args={[0.61, 0.61, 0.4, 64]} position={[0, 1.7, 0]} castShadow>
                <meshStandardMaterial color="#e5e7eb" metalness={1} roughness={0.1} />
            </Cylinder>
            {/* Pump */}
            <Cylinder args={[0.15, 0.15, 0.3, 32]} position={[0, 2.0, 0]} castShadow>
                <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 0.4, 16]} position={[0.1, 2.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
            </Cylinder>
        </group>
    );
};

// 4. HOME: Luxury Coffee Mug
export const ProceduralMug = ({ color = '#f59e0b', scale = 2.5, ...props }) => {
    return (
        <group scale={scale} position={[0, -0.6, 0]} {...props}>
            {/* Mug Body */}
            <Cylinder args={[0.5, 0.4, 1.0, 64, 1, true]} position={[0, 0.5, 0]} castShadow receiveShadow>
                <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.1} clearcoat={1} side={THREE.DoubleSide} />
            </Cylinder>
            {/* Mug Bottom */}
            <Cylinder args={[0.4, 0.4, 0.05, 64]} position={[0, 0.025, 0]} castShadow>
                <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.1} clearcoat={1} />
            </Cylinder>
            {/* Coffee Liquid */}
            <Cylinder args={[0.47, 0.47, 0.05, 32]} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#3E2723" roughness={0.1} metalness={0.1} />
            </Cylinder>
            {/* Handle */}
            <group position={[0.5, 0.5, 0]}>
                <mesh castShadow>
                    <torusGeometry args={[0.25, 0.08, 16, 64, Math.PI]} />
                    <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.1} clearcoat={1} />
                </mesh>
            </group>
        </group>
    );
};

// 5. BOOKS: Premium Hardcover
export const ProceduralBook = ({ color = '#3b82f6', scale = 2, ...props }) => {
    return (
        <group scale={scale} position={[0, -0.2, 0]} rotation={[0.2, -0.4, 0]} {...props}>
            {/* Pages */}
            <Box args={[1.4, 0.3, 2.0]} position={[0, 0, 0]} castShadow>
                <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
            </Box>
            {/* Top Cover */}
            <Box args={[1.45, 0.02, 2.1]} position={[0.02, 0.16, 0]} castShadow>
                <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
            </Box>
            {/* Bottom Cover */}
            <Box args={[1.45, 0.02, 2.1]} position={[0.02, -0.16, 0]} castShadow>
                <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
            </Box>
            {/* Spine */}
            <Box args={[0.05, 0.34, 2.1]} position={[-0.7, 0, 0]} castShadow>
                <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
            </Box>
            {/* Foil Stamp Logo */}
            <Box args={[0.4, 0.01, 0.4]} position={[0, 0.17, 0]}>
                <meshStandardMaterial color="#eab308" metalness={1} roughness={0.2} />
            </Box>
        </group>
    );
};

// 7. FASHION: T-Shirt
export const ProceduralShirt = ({ color = '#3b82f6', scale = 1.8, ...props }) => {
    return (
        <group scale={scale} position={[0, -1, 0]} {...props}>
            {/* Body */}
            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
                <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            {/* Sleeves */}
            <mesh castShadow receiveShadow position={[-0.6, 1.6, 0]} rotation={[0, 0, 0.5]}>
                <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
                <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.6, 1.6, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
                <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            {/* Neck cutout */}
            <mesh position={[0, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.25, 0.05, 16, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </group>
    );
};

// 8. CUSTOM: Delivery Truck (High Detail Procedural)
export const ProceduralTruck = ({ color = '#1d4ed8', scale = 1, ...props }) => {
    return (
        <group scale={scale} position={[0, 0.5, 0]} {...props}>
            {/* Cab */}
            <Box args={[1.5, 1.2, 1.2]} position={[1.5, 0.6, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </Box>
            {/* Cab Nose / Engine */}
            <Box args={[0.8, 0.8, 1.2]} position={[2.65, 0.4, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </Box>

            {/* Windows */}
            {/* Windshield */}
            <Box args={[0.1, 0.6, 1.0]} position={[2.22, 0.9, 0]} rotation={[0, 0, -0.3]}>
                <meshPhysicalMaterial color="#111" roughness={0.1} metalness={0.9} clearcoat={1} />
            </Box>
            {/* Side Windows */}
            <Box args={[0.8, 0.5, 1.22]} position={[1.5, 0.85, 0]}>
                <meshPhysicalMaterial color="#111" roughness={0.1} metalness={0.9} clearcoat={1} />
            </Box>

            {/* Grill & Headlights */}
            <Box args={[0.1, 0.5, 0.8]} position={[3.06, 0.4, 0]}>
                <meshStandardMaterial color="#333" roughness={0.8} metalness={0.9} />
            </Box>
            {/* Headlights */}
            <Box args={[0.1, 0.15, 0.15]} position={[3.06, 0.4, 0.4]} castShadow>
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
            </Box>
            <Box args={[0.1, 0.15, 0.15]} position={[3.06, 0.4, -0.4]} castShadow>
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
            </Box>
            {/* Bumper */}
            <Box args={[0.2, 0.15, 1.3]} position={[3.05, 0.1, 0]} castShadow>
                <meshStandardMaterial color="#222" roughness={0.8} />
            </Box>

            {/* Trailer/Cargo Box */}
            <Box args={[3.8, 2.0, 1.4]} position={[-1.3, 1.0, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.1} />
            </Box>

            {/* Vertexia Logo on Trailer */}
            <Box args={[1.5, 0.8, 1.42]} position={[-1.3, 1.2, 0]}>
                <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
            </Box>
            {/* White stripe */}
            <Box args={[3.8, 0.1, 1.41]} position={[-1.3, 0.5, 0]}>
                <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
            </Box>

            {/* Wheels */}
            {/* Front Wheels */}
            <Cylinder args={[0.3, 0.3, 1.3, 32]} position={[2.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <meshStandardMaterial color="#111" roughness={0.9} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 1.35, 16]} position={[2.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Rear Wheels 1 */}
            <Cylinder args={[0.3, 0.3, 1.3, 32]} position={[-1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <meshStandardMaterial color="#111" roughness={0.9} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 1.35, 16]} position={[-1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Rear Wheels 2 */}
            <Cylinder args={[0.3, 0.3, 1.3, 32]} position={[-2.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <meshStandardMaterial color="#111" roughness={0.9} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 1.35, 16]} position={[-2.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Exhaust */}
            <Cylinder args={[0.08, 0.08, 1.4, 16]} position={[1.0, 1.5, 0.65]} castShadow>
                <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.06, 0.06, 0.2, 16]} position={[1.0, 2.2, 0.65]} castShadow>
                <meshStandardMaterial color="#222" metalness={0.9} />
            </Cylinder>
        </group>
    );
};

// 6. DEFAULT / FALLBACK (Shoe)
// We just re-export the RealisticShoe component since we have the GLTF locally and it works perfectly.
export { RealisticShoe };

// 7. HOME APPLIANCE: Smart Speaker (Amazon Echo-style)
export const ProceduralSmartSpeaker = ({ scale = 1, ...props }) => {
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: '#1a1a2e', roughness: 0.85, metalness: 0.1 });
    const ringMat = new THREE.MeshPhysicalMaterial({ color: '#3b82f6', metalness: 0.7, roughness: 0.2, emissive: '#1d4ed8', emissiveIntensity: 0.4 });
    const topMat = new THREE.MeshPhysicalMaterial({ color: '#e2e8f0', metalness: 0.3, roughness: 0.6 });
    const meshMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.95, wireframe: false });

    return (
        <group scale={scale} {...props}>
            {/* Cylindrical body */}
            <Cylinder args={[0.85, 0.85, 2.4, 48]} position={[0, 0, 0]} castShadow receiveShadow>
                <primitive object={bodyMat} attach="material" />
            </Cylinder>

            {/* Fabric mesh texture suggestion – thin outer ring */}
            <Cylinder args={[0.87, 0.87, 2.0, 48]} position={[0, 0, 0]}>
                <primitive object={meshMat} attach="material" />
            </Cylinder>

            {/* Glowing LED ring at top */}
            <Cylinder args={[0.84, 0.84, 0.07, 48]} position={[0, 1.25, 0]}>
                <primitive object={ringMat} attach="material" />
            </Cylinder>

            {/* Top cap - smooth */}
            <Cylinder args={[0.84, 0.84, 0.06, 48]} position={[0, 1.28, 0]}>
                <primitive object={topMat} attach="material" />
            </Cylinder>

            {/* Base ring */}
            <Cylinder args={[0.9, 0.88, 0.08, 48]} position={[0, -1.22, 0]}>
                <primitive object={topMat} attach="material" />
            </Cylinder>

            {/* Volume dots – subtle indicators */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                return (
                    <Cylinder
                        key={i}
                        args={[0.035, 0.035, 0.04, 12]}
                        position={[Math.sin(rad) * 0.86, 0.9, Math.cos(rad) * 0.86]}
                        rotation={[0, 0, Math.PI / 2]}
                    >
                        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.8} />
                    </Cylinder>
                );
            })}
        </group>
    );
};
// 8. LOGISTICS: Procedural Parcel / Shipping Box
export const ProceduralParcel = ({ scale = 1, ...props }) => {
    const boxColor = "#d4b58e"; // Classic cardboard
    const tapeColor = "#574023"; // Dark packing tape

    return (
        <group scale={scale} {...props}>
            {/* Main Box Body */}
            <RoundedBox args={[2, 1.5, 2]} radius={0.05} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color={boxColor} roughness={0.8} metalness={0.1} />
            </RoundedBox>

            {/* Packing Tape - Horizonal */}
            <mesh position={[0, 0.76, 0]}>
                <boxGeometry args={[2.02, 0.02, 0.4]} />
                <meshStandardMaterial color={tapeColor} roughness={0.6} />
            </mesh>

            {/* Packing Tape - Vertical (Sides) */}
            <mesh position={[1.01, 0, 0]}>
                <boxGeometry args={[0.02, 1.52, 0.4]} />
                <meshStandardMaterial color={tapeColor} roughness={0.6} />
            </mesh>
            <mesh position={[-1.01, 0, 0]}>
                <boxGeometry args={[0.02, 1.52, 0.4]} />
                <meshStandardMaterial color={tapeColor} roughness={0.6} />
            </mesh>

            {/* Shipping Label */}
            <mesh position={[0.4, 0.76, 0.5]} rotation={[-Math.PI / 2, 0, 0.2]}>
                <planeGeometry args={[0.6, 0.8]} />
                <meshStandardMaterial color="#ffffff" roughness={1} />
            </mesh>

            {/* Barcode suggestion on label */}
            <mesh position={[0.4, 0.761, 0.6]} rotation={[-Math.PI / 2, 0, 0.2]}>
                <planeGeometry args={[0.4, 0.05]} />
                <meshBasicMaterial color="#111" />
            </mesh>

            {/* Vertexia Brand Stamp "V" */}
            <mesh position={[0, 0, 1.01]}>
                <planeGeometry args={[0.8, 0.8]} />
                <meshBasicMaterial color="#1d4ed8" transparent opacity={0.4} />
            </mesh>
        </group>
    );
};

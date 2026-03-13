import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VertexiaLogo = ({ scale = 1.2, color1 = "#1d4ed8", color2 = "#38bdf8", ...props }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 1.5;
        }
    });

    // Main V
    const vShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.6, 1);
        shape.lineTo(-0.2, 1);
        shape.lineTo(0, -0.2); // inner bottom
        shape.lineTo(0.2, 1);
        shape.lineTo(0.6, 1);
        shape.lineTo(0, -1); // outer bottom
        shape.lineTo(-0.6, 1);
        return shape;
    }, []);

    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.03, bevelThickness: 0.03 };

    return (
        <group ref={groupRef} scale={scale} position={[0, 0, 0]} {...props}>
            <mesh position={[0, 0, -0.15]} castShadow receiveShadow>
                <extrudeGeometry args={[vShape, extrudeSettings]} />
                <meshStandardMaterial color={color1} roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.1, 0.15]} scale={0.8} castShadow receiveShadow>
                <extrudeGeometry args={[vShape, { ...extrudeSettings, depth: 0.1 }]} />
                <meshStandardMaterial color={color2} roughness={0.1} metalness={0.9} />
            </mesh>
        </group>
    );
};

export default VertexiaLogo;

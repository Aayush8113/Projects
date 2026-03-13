import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function RealisticShoe(props) {
    const { scene } = useGLTF('/models/Shoe.glb');

    // Clone scene to allow multiple instances on the same canvas
    const copiedScene = useMemo(() => scene.clone(), [scene]);

    // Optional: if we want to apply a color tint passed from props (like in Dashboard)
    // we could traverse the scene and tint materials, but for a photorealistic asset,
    // it's usually better to preserve the original textures.
    // If props.color is provided, we can apply a slight emissive tint or color tint to the root.
    useMemo(() => {
        if (props.color) {
            copiedScene.traverse((child) => {
                if (child.isMesh && child.material) {
                    // Clone material to avoid affecting other instances
                    const oldMat = child.material;
                    child.material = child.material.clone();
                    child.material.color.set(props.color);

                    // We don't dispose the oldMat here because it might be the shared source
                    // but we ensure the new material is tracked by R3F for disposal
                }
            });
        }
    }, [copiedScene, props.color]);

    // Omit color from props passed to primitive to avoid React warning
    const { color, ...restProps } = props;

    // Apply a scale fix if the Khronos model is massive or tiny, typically it's ~0.3m
    // We can also let the parent scale it. Let's scale it slightly up to match AbstractSneaker proportions.
    return (
        <primitive object={copiedScene} scale={1.0} {...restProps} />
    );
}

useGLTF.preload('/models/Shoe.glb');

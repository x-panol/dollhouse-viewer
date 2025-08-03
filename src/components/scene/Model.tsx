import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import modelUrl from "../../assets/tourmodel.obj?url";
import textureUrl from "../../assets/texture.jpg";

export function Model(props: any) {
  // Load texture and optimize it
  const texture = useTexture(textureUrl);

  // Configure texture properties
  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Remove negative values that flip texture
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
  }, [texture]);

  // Create optimized materials
  const materials = useMemo(() => {
    // Primary material with proper lighting
    const primaryMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.1,
    });

    // Fallback material for meshes without UV coordinates
    const fallbackMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });

    return { primaryMaterial, fallbackMaterial };
  }, [texture]);

  // Load the OBJ model
  const scene = useLoader(OBJLoader, modelUrl);

  // Apply materials to the loaded model
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        // Check if the mesh has UV coordinates
        const hasUVs = child.geometry.attributes.uv !== undefined;

        if (hasUVs) {
          // Use textured material for meshes with UV coordinates
          child.material = materials.primaryMaterial;
        } else {
          // Use fallback material for meshes without UV coordinates
          child.material = materials.fallbackMaterial;
          console.warn(
            "Mesh without UV coordinates found, using fallback material"
          );
        }

        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;

        // Ensure geometry is optimized
        if (child.geometry) {
          child.geometry.computeVertexNormals();
          child.geometry.computeBoundingBox();
        }
      }
    });
  }, [scene, materials]);

  if (!scene) {
    return null;
  }

  return (
    <group
      scale={[100, 100, 100]}
      rotation={[0, 0, 0]} // Remove the -Math.PI/2 rotation that was causing coordinate issues
      {...props}
    >
      <primitive object={scene} />
    </group>
  );
}

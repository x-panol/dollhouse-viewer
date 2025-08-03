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
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(1, 1); // Remove negative values that flip texture

    // texture.magFilter = THREE.LinearFilter;
    // texture.generateMipmaps = true;
    // texture.needsUpdate = true;

    texture.colorSpace = THREE.SRGBColorSpace; // r152+
    // texture.encoding = THREE.sRGBEncoding;  // for older three
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
  }, [texture]);

  // Create optimized materials for baked lighting
  const materials = useMemo(() => {
    // Primary material for baked textures (unaffected by lighting)
    const primaryMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    // Fallback material for meshes without UV coordinates
    const fallbackMaterial = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
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

import { Canvas, useThree } from "@react-three/fiber";
import {
  PointerLockControls,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import {
  Suspense,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Model } from "./Model";
import { usePhysicsNavigation } from "../../hooks/usePhysicsNavigation";
import * as THREE from "three";

const Scene = ({ viewMode }: { viewMode: "fps" | "dollhouse" }) => {
  if (viewMode === "fps") {
    usePhysicsNavigation();
  }

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} />

      {/* Environment for better reflections */}
      <Environment preset="apartment" />

      {/* The 3D model */}
      <Model />
    </>
  );
};

const CameraController = ({
  viewMode,
  onCameraChange,
}: {
  viewMode: "fps" | "dollhouse";
  onCameraChange: (camera: THREE.Camera) => void;
}) => {
  const { camera } = useThree();

  useEffect(() => {
    onCameraChange(camera);
  }, [camera, onCameraChange]);

  return null;
};

interface ExperienceHandle {
  switchToDollhouseView: () => void;
  switchToFPSView: () => void;
}

export const Experience = forwardRef<ExperienceHandle>((props, ref) => {
  const [viewMode, setViewMode] = useState<"fps" | "dollhouse">("fps");
  const pointerControlsRef = useRef<any>(null);
  const orbitControlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  const handleCameraChange = (camera: THREE.Camera) => {
    cameraRef.current = camera;
  };

  useImperativeHandle(ref, () => ({
    switchToDollhouseView: () => {
      setViewMode("dollhouse");

      // Exit pointer lock if active
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }

      // Move camera to dollhouse overview position
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 80, 100);
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Enable orbit controls after a short delay
      setTimeout(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
          orbitControlsRef.current.target.set(0, 20, 0);
        }
      }, 100);
    },

    switchToFPSView: () => {
      setViewMode("fps");

      // Disable orbit controls
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }

      // Reset camera to FPS position
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 10, 20);
      }
    },
  }));

  return (
    <Canvas
      camera={{
        position: [0, 10, 20],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <CameraController
        viewMode={viewMode}
        onCameraChange={handleCameraChange}
      />

      <Suspense fallback={null}>
        <Scene viewMode={viewMode} />
      </Suspense>

      {/* FPS Controls - only active in FPS mode */}
      {viewMode === "fps" && (
        <PointerLockControls
          ref={pointerControlsRef}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
          pointerSpeed={0.8}
        />
      )}

      {/* Orbit Controls - only active in dollhouse mode */}
      {viewMode === "dollhouse" && (
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={200}
          target={[0, 20, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />
      )}

      {/* Development helper - remove in production */}
      {/* <axesHelper args={[5]} /> */}
    </Canvas>
  );
});

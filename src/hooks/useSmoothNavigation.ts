import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

export const useSmoothNavigation = () => {
  const { camera, controls } = useThree();

  const navigateTo = (point: THREE.Vector3) => {
    const targetPosition = point.clone();

    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: 'power2.inOut',
    });

    if (controls) {
      // Animate OrbitControls target
      gsap.to(controls.target, {
        x: point.x,
        y: point.y,
        z: point.z,
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }
  };

  return navigateTo;
};

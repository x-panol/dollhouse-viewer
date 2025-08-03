import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from './useKeyboardControls';
import * as THREE from 'three';
import { useRef } from 'react';

// FPS Movement Configuration - ULTRA FAST
const MOVE_SPEED = 30.0;         // Much faster base movement speed
const SPRINT_MULTIPLIER = 2.5;   // Even faster sprint
const JUMP_FORCE = 20.0;         // Higher jumps
const GRAVITY = -35.0;           // Stronger gravity
const GROUND_FRICTION = 0.9;     // Less friction for smoother movement
const AIR_FRICTION = 0.95;       // Less air resistance
const GROUND_HEIGHT = 8.0;       // Ground level
const PLAYER_HEIGHT = 1.6;       // Camera height above ground
const MAX_FALL_SPEED = -30.0;    // Higher terminal velocity

export const usePhysicsNavigation = () => {
  const { camera } = useThree();
  const { forward, backward, left, right, jump } = useKeyboardControls();

  // Physics state
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);
  const jumpPressed = useRef(false);

  useFrame((_, delta) => {
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Fix coordinate system: use proper horizontal plane for movement
    const forwardDir = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
    const rightDir = new THREE.Vector3().crossVectors(forwardDir, new THREE.Vector3(0, 1, 0)).normalize();

    // Calculate horizontal movement input
    const inputVector = new THREE.Vector3(0, 0, 0);
    if (forward) inputVector.add(forwardDir);
    if (backward) inputVector.sub(forwardDir);
    if (right) inputVector.add(rightDir);
    if (left) inputVector.sub(rightDir);

    // Normalize input to prevent faster diagonal movement
    if (inputVector.length() > 0) {
      inputVector.normalize();
    }

    // Calculate target speed (with sprint support)
    const isSprintPressed = (window as any).shiftPressed || false;
    const targetSpeed = MOVE_SPEED * (isSprintPressed ? SPRINT_MULTIPLIER : 1.0);
    const targetVelocity = inputVector.multiplyScalar(targetSpeed);

    // Apply movement with high acceleration for instant response
    const friction = isGrounded.current ? GROUND_FRICTION : AIR_FRICTION;
    const acceleration = isGrounded.current ? 20.0 : 8.0; // Very high acceleration

    // Horizontal movement
    velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelocity.x, acceleration * delta);
    velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelocity.z, acceleration * delta);

    // Apply friction when no input
    if (inputVector.length() === 0) {
      velocity.current.x *= Math.pow(friction, delta * 60);
      velocity.current.z *= Math.pow(friction, delta * 60);
    }

    // Jumping logic
    if (jump && !jumpPressed.current && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
      jumpPressed.current = true;
    }
    if (!jump) {
      jumpPressed.current = false;
    }

    // Apply gravity
    if (!isGrounded.current) {
      velocity.current.y += GRAVITY * delta;
      velocity.current.y = Math.max(velocity.current.y, MAX_FALL_SPEED);
    }

    // Ground collision detection (basic, no walls)
    const nextY = camera.position.y + velocity.current.y * delta;
    const groundY = GROUND_HEIGHT + PLAYER_HEIGHT;

    if (nextY <= groundY && velocity.current.y <= 0) {
      camera.position.y = groundY;
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      camera.position.y += velocity.current.y * delta;
      if (camera.position.y > groundY + 0.1) {
        isGrounded.current = false;
      }
    }

    // Apply horizontal movement - NO COLLISION DETECTION, FREE MOVEMENT
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;
  });

  // Add sprint key listener
  if (typeof window !== 'undefined') {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        (window as any).shiftPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        (window as any).shiftPressed = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }
};

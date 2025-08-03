import { useEffect, useState } from 'react';

const moveFieldByKey = (key: string) => {
  const keys: Record<string, string> = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump',
  };
  return keys[key];
};

export const useKeyboardControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code);
      if (field) {
        setMovement((state) => ({ ...state, [field]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code);
      if (field) {
        setMovement((state) => ({ ...state, [field]: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};

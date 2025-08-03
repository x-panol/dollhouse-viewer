import React from "react";

interface HudProps {
  onDollhouseView: () => void;
  onResetView: () => void;
}

export function Hud({ onDollhouseView, onResetView }: HudProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top buttons */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={onDollhouseView}
          className="pointer-events-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          🏠 Dollhouse View
        </button>
        <button
          onClick={onResetView}
          className="pointer-events-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          🎮 FPS View
        </button>
      </div>

      {/* FPS Controls Guide */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <div className="font-semibold mb-2">⚡ ULTRA FAST Controls:</div>
        <div className="space-y-1">
          <div>
            <span className="font-mono bg-gray-800 px-1 rounded">WASD</span> -
            Move (ULTRA FAST!)
          </div>
          <div>
            <span className="font-mono bg-gray-800 px-1 rounded">SPACE</span> -
            Jump High
          </div>
          <div>
            <span className="font-mono bg-gray-800 px-1 rounded">SHIFT</span> -
            Sprint (2.5x speed!)
          </div>
          <div>
            <span className="font-mono bg-gray-800 px-1 rounded">MOUSE</span> -
            Look around
          </div>
          <div className="text-xs text-gray-300 mt-2">
            ✨ Click anywhere to lock cursor & enter FPS mode
          </div>
          <div className="text-xs text-green-300">
            🚀 Movement is ULTRA FAST with no collision!
          </div>
          <div className="text-xs text-purple-300">
            🏠 Use Dollhouse View for overview
          </div>
        </div>
      </div>

      {/* Crosshair - only show in FPS mode */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 pointer-events-none">
          {/* Simple crosshair */}
          <div className="absolute w-0.5 h-4 bg-white/60 left-1/2 transform -translate-x-1/2"></div>
          <div className="absolute h-0.5 w-4 bg-white/60 top-1/2 transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}

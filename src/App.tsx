import { Suspense, useRef } from "react";
import { Experience } from "./components/scene/Experience";
import { Loader } from "./components/ui/Loader";
import { Hud } from "./components/ui/Hud";

function App() {
  const experienceRef = useRef<any>(null);

  const handleDollhouseView = () => {
    // Switch to dollhouse overview mode
    if (experienceRef.current && experienceRef.current.switchToDollhouseView) {
      experienceRef.current.switchToDollhouseView();
    }
  };

  const handleResetView = () => {
    // Reset to FPS first-person mode
    if (experienceRef.current && experienceRef.current.switchToFPSView) {
      experienceRef.current.switchToFPSView();
    }
  };

  return (
    <>
      <Hud
        onDollhouseView={handleDollhouseView}
        onResetView={handleResetView}
      />
      <Suspense fallback={<Loader />}>
        <Experience ref={experienceRef} />
      </Suspense>
    </>
  );
}

export default App;

import { Suspense, useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

interface JourneyCanvasProps {
  className?: string;
  cameraPosition?: [number, number, number];
  children: ReactNode;
}

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export default function JourneyCanvas({ className = "h-48", cameraPosition = [3, 3, 3], children }: JourneyCanvasProps) {
  const canRender = useMemo(() => supportsWebGL(), []);

  if (!canRender) {
    return (
      <div className={`${className} grid place-items-center rounded-xl border border-[#2b342b] bg-[#111611] text-xs text-[#8fa095]`}>
        3D preview unavailable on this device
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden rounded-xl border border-[#2b342b] bg-[#0f130f]`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: cameraPosition, fov: 35 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 3]} intensity={1} color="#f0fff0" />
          <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#9dff3f" />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

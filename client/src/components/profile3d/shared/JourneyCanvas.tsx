import { Suspense, useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

interface JourneyCanvasProps {
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  orthographic?: boolean;
  zoom?: number;
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

export default function JourneyCanvas({
  className = "h-48",
  cameraPosition = [3, 3, 3],
  fov = 34,
  orthographic = false,
  zoom = 120,
  children,
}: JourneyCanvasProps) {
  const canRender = useMemo(() => supportsWebGL(), []);
  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

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
        dpr={prefersReducedMotion ? 1 : [1, 1.35]}
        orthographic={orthographic}
        camera={orthographic ? { position: cameraPosition, zoom } : { position: cameraPosition, fov }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.48} color="#f2f8f2" />
          <directionalLight position={[4.5, 5.2, 2.8]} intensity={1.02} color="#f1f6f1" />
          <directionalLight position={[-3.2, 1.4, -3.1]} intensity={0.24} color="#cdd8cd" />
          <directionalLight position={[0, 2.4, -4]} intensity={0.18} color="#9dff3f" />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

import { useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import JourneyCanvas from "./shared/JourneyCanvas";
import type { PlayerCardData3D } from "./shared/types";

interface PlayerCard3DProps {
  data: PlayerCardData3D;
}

function CardModel({ data }: { data: PlayerCardData3D }) {
  const groupRef = useRef<Group>(null);
  const [target, setTarget] = useState({ rx: 0, ry: 0, flip: false });

  useFrame(() => {
    if (!groupRef.current) return;

    const targetY = target.flip ? Math.PI : target.ry;
    groupRef.current.rotation.x += (target.rx - groupRef.current.rotation.x) * 0.15;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.15;
  });

  const reliabilityScale = Math.max(0.2, data.reliability / 100);
  const sportsmanshipScale = Math.max(0.2, data.sportsmanship / 100);
  const attendanceScale = Math.max(0.2, data.attendance / 100);

  return (
    <group
      ref={groupRef}
      onPointerMove={(e) => {
        const x = e.pointer.x;
        const y = e.pointer.y;
        setTarget((prev) => ({ ...prev, ry: x * 0.28, rx: -y * 0.18 }));
      }}
      onPointerOut={() => setTarget((prev) => ({ ...prev, rx: 0, ry: 0 }))}
      onPointerDown={() => setTarget((prev) => ({ ...prev, flip: !prev.flip }))}
      position={[0, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[2.7, 1.65, 0.12]} />
        <meshStandardMaterial color="#171d18" roughness={0.7} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.5, 1.45, 0.03]} />
        <meshStandardMaterial color="#1f2721" roughness={0.55} metalness={0.16} />
      </mesh>

      <mesh position={[0, 0, 0.078]}>
        <planeGeometry args={[2.35, 1.3]} />
        <meshStandardMaterial color="#212a23" roughness={0.8} metalness={0.05} />
      </mesh>

      <mesh position={[-0.95, 0.22, 0.09]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 24]} />
        <meshStandardMaterial color="#273329" roughness={0.4} metalness={0.12} />
      </mesh>

      <mesh position={[-0.18, 0.39, 0.11]}>
        <boxGeometry args={[1.2, 0.06, 0.02]} />
        <meshStandardMaterial color="#dfe9df" roughness={0.7} metalness={0.02} />
      </mesh>

      <mesh position={[-0.32, 0.22, 0.11]}>
        <boxGeometry args={[0.92, 0.04, 0.02]} />
        <meshStandardMaterial color="#98a89d" roughness={0.8} metalness={0.02} />
      </mesh>

      <mesh position={[0.77, -0.5, 0.11]}>
        <boxGeometry args={[0.56, 0.14, 0.03]} />
        <meshStandardMaterial color="#9dff3f" roughness={0.45} metalness={0.08} />
      </mesh>

      <group position={[-1.08, -0.34, 0.1]}>
        <mesh position={[0.45 * reliabilityScale, 0.2, 0]}>
          <boxGeometry args={[0.9 * reliabilityScale, 0.05, 0.02]} />
          <meshStandardMaterial color="#95d57a" roughness={0.6} metalness={0.04} />
        </mesh>
        <mesh position={[0.45 * sportsmanshipScale, 0.05, 0]}>
          <boxGeometry args={[0.9 * sportsmanshipScale, 0.05, 0.02]} />
          <meshStandardMaterial color="#7fae84" roughness={0.65} metalness={0.03} />
        </mesh>
        <mesh position={[0.45 * attendanceScale, -0.1, 0]}>
          <boxGeometry args={[0.9 * attendanceScale, 0.05, 0.02]} />
          <meshStandardMaterial color="#6f8f76" roughness={0.7} metalness={0.02} />
        </mesh>
      </group>

      <group rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[2.25, 1.2]} />
          <meshStandardMaterial color="#1a221c" roughness={0.82} metalness={0.04} />
        </mesh>

        <mesh position={[-0.75, 0.25, 0.1]}>
          <boxGeometry args={[0.65, 0.18, 0.03]} />
          <meshStandardMaterial color="#9dff3f" roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[0.2, 0.25, 0.1]}>
          <boxGeometry args={[0.95, 0.18, 0.03]} />
          <meshStandardMaterial color="#d8e2d9" roughness={0.7} metalness={0.03} />
        </mesh>

        <mesh position={[-0.55, -0.05, 0.1]}>
          <boxGeometry args={[1.05, 0.1, 0.02]} />
          <meshStandardMaterial color="#8ca28f" roughness={0.75} metalness={0.03} />
        </mesh>
        <mesh position={[-0.55, -0.23, 0.1]}>
          <boxGeometry args={[1.05, 0.1, 0.02]} />
          <meshStandardMaterial color="#7e9482" roughness={0.75} metalness={0.03} />
        </mesh>
      </group>
    </group>
  );
}

export default function PlayerCard3D({ data }: PlayerCard3DProps) {
  return (
    <JourneyCanvas className="h-64" cameraPosition={[0, 0, 4.5]}>
      <CardModel data={data} />
    </JourneyCanvas>
  );
}

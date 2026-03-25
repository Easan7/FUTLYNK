import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import JourneyCanvas from "./shared/JourneyCanvas";
import type { Achievement3D } from "./shared/types";

interface AchievementLocker3DProps {
  achievements: Achievement3D[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function AchievementShape({ type, unlocked, selected }: { type: Achievement3D["shape"]; unlocked: boolean; selected: boolean }) {
  const color = unlocked ? (selected ? "#9dff3f" : "#88a08b") : "#38423b";

  if (type === "coin") {
    return (
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.08, 24]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.45} />
      </mesh>
    );
  }

  if (type === "shield") {
    return (
      <group>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.3, 0.28, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <coneGeometry args={[0.15, 0.18, 4]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  if (type === "star") {
    return (
      <mesh>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.28} />
      </mesh>
    );
  }

  if (type === "trophy") {
    return (
      <group>
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.15, 0.26, 12]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.2, 0.06, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh>
      <boxGeometry args={[0.32, 0.22, 0.06]} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.15} />
    </mesh>
  );
}

function LockerItem({
  achievement,
  x,
  y,
  selected,
  onSelect,
}: {
  achievement: Achievement3D;
  x: number;
  y: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z += ((selected ? 0.18 : 0) - ref.current.position.z) * 0.12;
    ref.current.rotation.y += ((selected ? 0.12 : 0) - ref.current.rotation.y) * 0.12;
  });

  return (
    <group ref={ref} position={[x, y, 0]} onPointerDown={onSelect}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[0.64, 0.64, 0.08]} />
        <meshStandardMaterial color="#1d241f" roughness={0.85} metalness={0.04} />
      </mesh>
      <AchievementShape type={achievement.shape} unlocked={achievement.unlocked} selected={selected} />
    </group>
  );
}

export default function AchievementLocker3D({ achievements, selectedId, onSelect }: AchievementLocker3DProps) {
  const slots = [
    [-0.9, 0.38],
    [0, 0.38],
    [0.9, 0.38],
    [-0.9, -0.38],
    [0, -0.38],
    [0.9, -0.38],
  ];

  return (
    <JourneyCanvas className="h-56" cameraPosition={[3, 2.6, 3.3]}>
      <group position={[0, -0.15, 0]}>
        <mesh position={[0, 0, -0.16]}>
          <boxGeometry args={[3.2, 2.15, 0.22]} />
          <meshStandardMaterial color="#151a16" roughness={0.95} metalness={0.02} />
        </mesh>

        {achievements.slice(0, 6).map((achievement, idx) => (
          <LockerItem
            key={achievement.id}
            achievement={achievement}
            x={slots[idx]?.[0] ?? 0}
            y={slots[idx]?.[1] ?? 0}
            selected={achievement.id === selectedId}
            onSelect={() => onSelect(achievement.id)}
          />
        ))}
      </group>

    </JourneyCanvas>
  );
}

import { useMemo, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import JourneyCanvas from "./shared/JourneyCanvas";
import type { RecentMatch3D } from "./shared/types";

interface PitchTimeline3DProps {
  matches: RecentMatch3D[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function MatchNode({
  x,
  match,
  selected,
  onSelect,
}: {
  x: number;
  match: RecentMatch3D;
  selected: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<Mesh>(null);
  const targetY = 0.12 + match.importance * 0.18;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = selected ? Math.sin(clock.elapsedTime * 4) * 0.03 : 0;
    groupRef.current.scale.y += (1 + pulse - groupRef.current.scale.y) * 0.12;
  });

  return (
    <mesh
      ref={groupRef}
      position={[x, targetY / 2 + 0.04, 0]}
      onPointerDown={onSelect}
    >
      <cylinderGeometry args={[0.09 + match.players * 0.002, 0.09, targetY, 16]} />
      <meshStandardMaterial color={selected ? "#9dff3f" : "#5f7260"} roughness={0.42} metalness={0.08} />
    </mesh>
  );
}

export default function PitchTimeline3D({ matches, selectedId, onSelect }: PitchTimeline3DProps) {
  const positions = useMemo(() => {
    if (!matches.length) return [];
    return matches.map((_, idx) => -1.45 + (idx / Math.max(matches.length - 1, 1)) * 2.9);
  }, [matches]);

  return (
    <JourneyCanvas className="h-56" cameraPosition={[3.4, 2.8, 3.2]}>
      <group position={[0, -0.35, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[4.4, 0.2, 2.5]} />
          <meshStandardMaterial color="#171c18" roughness={0.9} metalness={0.05} />
        </mesh>

        <mesh>
          <boxGeometry args={[4.0, 0.08, 2.1]} />
          <meshStandardMaterial color="#1f2621" roughness={0.85} metalness={0.02} />
        </mesh>

        <mesh position={[0, 0.045, 0]}>
          <ringGeometry args={[0.35, 0.37, 32]} />
          <meshBasicMaterial color="#7f8d82" transparent opacity={0.45} />
        </mesh>

        <mesh position={[0, 0.046, 0]}>
          <planeGeometry args={[0.02, 2.05]} />
          <meshBasicMaterial color="#7f8d82" transparent opacity={0.45} />
        </mesh>

        <mesh position={[-1.72, 0.046, 0]}>
          <planeGeometry args={[0.02, 0.9]} />
          <meshBasicMaterial color="#6d7a70" transparent opacity={0.35} />
        </mesh>
        <mesh position={[-1.32, 0.046, 0]}>
          <planeGeometry args={[0.02, 0.9]} />
          <meshBasicMaterial color="#6d7a70" transparent opacity={0.35} />
        </mesh>
        <mesh position={[1.72, 0.046, 0]}>
          <planeGeometry args={[0.02, 0.9]} />
          <meshBasicMaterial color="#6d7a70" transparent opacity={0.35} />
        </mesh>
        <mesh position={[1.32, 0.046, 0]}>
          <planeGeometry args={[0.02, 0.9]} />
          <meshBasicMaterial color="#6d7a70" transparent opacity={0.35} />
        </mesh>

        {matches.map((match, idx) => (
          <MatchNode
            key={match.id}
            x={positions[idx] ?? 0}
            match={match}
            selected={match.id === selectedId}
            onSelect={() => onSelect(match.id)}
          />
        ))}
      </group>

    </JourneyCanvas>
  );
}

import { useMemo, useRef } from "react";
import { Group, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import JourneyCanvas from "./shared/JourneyCanvas";
import type { RecentMatch3D } from "./shared/types";
import { journeyPalette, mat } from "./shared/materials";

interface PitchTimeline3DProps {
  matches: RecentMatch3D[];
  selectedId: string;
  onSelect: (id: string) => void;
}

type NodePoint = { x: number; z: number };

function PathSegment({ from, to }: { from: NodePoint; to: NodePoint }) {
  const fromV = useMemo(() => new Vector3(from.x, 0.09, from.z), [from.x, from.z]);
  const toV = useMemo(() => new Vector3(to.x, 0.09, to.z), [to.x, to.z]);
  const mid = useMemo(() => fromV.clone().add(toV).multiplyScalar(0.5), [fromV, toV]);
  const length = useMemo(() => fromV.distanceTo(toV), [fromV, toV]);
  const quat = useMemo(() => {
    const dir = toV.clone().sub(fromV).normalize();
    const q = new Quaternion();
    q.setFromUnitVectors(new Vector3(0, 1, 0), dir);
    return q;
  }, [fromV, toV]);

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.016, 0.016, length, 12]} />
      <meshStandardMaterial color="#5f6d63" roughness={0.62} metalness={0.14} />
    </mesh>
  );
}

function MatchPin({
  point,
  match,
  selected,
  isLatest,
  index,
  onSelect,
}: {
  point: NodePoint;
  match: RecentMatch3D;
  selected: boolean;
  isLatest: boolean;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<Group>(null);
  const targetHeight = 0.14 + match.importance * 0.24;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const elapsed = clock.elapsedTime;
    const rise = Math.max(0, Math.min(1, (elapsed - index * 0.08) / 0.35));
    const pulse = selected ? Math.sin(elapsed * 4) * 0.018 : 0;

    ref.current.position.y += ((0.01 + rise * targetHeight) - ref.current.position.y) * 0.16;
    ref.current.scale.setScalar(1 + pulse);
  });

  const headColor = selected ? journeyPalette.accent : isLatest ? "#97d76a" : "#7f9682";

  return (
    <group ref={ref} position={[point.x, 0.01, point.z]} onPointerDown={onSelect}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.16, 10]} />
        <meshStandardMaterial {...mat.trim} />
      </mesh>

      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.068 + match.players * 0.0014, 16, 16]} />
        <meshStandardMaterial color={headColor} roughness={0.46} metalness={0.14} />
      </mesh>

      <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.075, 0.09, 24]} />
        <meshBasicMaterial color={selected || isLatest ? journeyPalette.accent : journeyPalette.line} transparent opacity={selected || isLatest ? 0.9 : 0.35} />
      </mesh>
    </group>
  );
}

export default function PitchTimeline3D({ matches, selectedId, onSelect }: PitchTimeline3DProps) {
  const points = useMemo<NodePoint[]>(() => {
    if (!matches.length) return [];
    return matches.map((_, idx) => {
      const t = idx / Math.max(matches.length - 1, 1);
      return {
        x: -1.35 + t * 2.7,
        z: Math.sin(t * Math.PI) * 0.34 - 0.17,
      };
    });
  }, [matches]);

  const latestId = matches[matches.length - 1]?.id;

  return (
    <JourneyCanvas className="h-56" cameraPosition={[2.45, 2.05, 2.35]} fov={33}>
      <group position={[0, -0.31, 0]}>
        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[3.95, 0.24, 2.2]} />
          <meshStandardMaterial {...mat.base} />
        </mesh>

        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[3.7, 0.06, 2.0]} />
          <meshStandardMaterial {...mat.elevated} />
        </mesh>

        <mesh position={[0, 0.015, 0]}>
          <planeGeometry args={[3.55, 1.85]} />
          <meshStandardMaterial color="#263128" roughness={0.84} metalness={0.02} />
        </mesh>

        <mesh position={[0, 0.021, 0]}>
          <planeGeometry args={[0.03, 1.78]} />
          <meshBasicMaterial color={journeyPalette.line} transparent opacity={0.42} />
        </mesh>
        <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.27, 0.3, 40]} />
          <meshBasicMaterial color={journeyPalette.line} transparent opacity={0.35} />
        </mesh>

        <mesh position={[-1.52, 0.021, 0]}>
          <planeGeometry args={[0.03, 0.7]} />
          <meshBasicMaterial color={journeyPalette.line} transparent opacity={0.25} />
        </mesh>
        <mesh position={[1.52, 0.021, 0]}>
          <planeGeometry args={[0.03, 0.7]} />
          <meshBasicMaterial color={journeyPalette.line} transparent opacity={0.25} />
        </mesh>

        {points.slice(0, -1).map((point, idx) => (
          <PathSegment key={`seg-${idx}`} from={point} to={points[idx + 1] as NodePoint} />
        ))}

        {matches.map((match, idx) => (
          <MatchPin
            key={match.id}
            point={points[idx] ?? { x: 0, z: 0 }}
            match={match}
            selected={match.id === selectedId}
            isLatest={match.id === latestId}
            index={idx}
            onSelect={() => onSelect(match.id)}
          />
        ))}
      </group>
    </JourneyCanvas>
  );
}

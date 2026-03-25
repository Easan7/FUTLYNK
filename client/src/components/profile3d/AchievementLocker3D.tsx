import { useMemo, useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import JourneyCanvas from "./shared/JourneyCanvas";
import type { Achievement3D } from "./shared/types";
import { journeyPalette, mat } from "./shared/materials";

interface AchievementLocker3DProps {
  achievements: Achievement3D[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function TrophyShape({
  type,
  unlocked,
  selected,
  featured,
}: {
  type: Achievement3D["shape"];
  unlocked: boolean;
  selected: boolean;
  featured: boolean;
}) {
  const accent = selected || featured ? journeyPalette.accent : journeyPalette.accentSoft;
  const trophyMetal = unlocked ? accent : "#57605a";
  const trim = unlocked ? "#ccd6cf" : "#545d58";
  const baseColor = unlocked ? "#465046" : "#2f3531";
  const darkInset = unlocked ? "#1f261f" : "#222823";
  const bodyMaterial = { color: trophyMetal, roughness: 0.31, metalness: 0.66 };
  const trimMaterial = { color: trim, roughness: 0.44, metalness: 0.38 };
  const standMaterial = { color: baseColor, roughness: 0.67, metalness: 0.2 };

  return (
    <group>
      <mesh position={[0, -0.45, 0.03]}>
        <boxGeometry args={[0.36, 0.08, 0.24]} />
        <meshStandardMaterial {...standMaterial} />
      </mesh>
      <mesh position={[0, -0.4, 0.03]}>
        <boxGeometry args={[0.24, 0.035, 0.17]} />
        <meshStandardMaterial color={unlocked ? "#5a665f" : "#3b423d"} roughness={0.58} metalness={0.22} />
      </mesh>
      <mesh position={[0, -0.382, 0.045]}>
        <boxGeometry args={[0.16, 0.008, 0.11]} />
        <meshStandardMaterial color={darkInset} roughness={0.82} metalness={0.04} />
      </mesh>

      {!unlocked ? (
        <group>
          <mesh position={[0, -0.24, 0.03]}>
            <cylinderGeometry args={[0.032, 0.032, 0.15, 18]} />
            <meshStandardMaterial color="#39413c" roughness={0.82} metalness={0.08} />
          </mesh>
          <mesh position={[0, -0.1, 0.04]}>
            <cylinderGeometry args={[0.12, 0.08, 0.18, 12]} />
            <meshStandardMaterial color="#333b35" roughness={0.88} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.1, 0.09]}>
            <ringGeometry args={[0.045, 0.07, 16]} />
            <meshStandardMaterial color="#4f5752" roughness={0.73} metalness={0.16} />
          </mesh>
        </group>
      ) : null}

      {unlocked && type === "trophy" ? (
        <group>
          <mesh position={[0, -0.27, 0.03]}>
            <cylinderGeometry args={[0.034, 0.038, 0.14, 20]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.12, 0.03]}>
            <cylinderGeometry args={[0.09, 0.13, 0.16, 28]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.035, 0.03]}>
            <torusGeometry args={[0.1, 0.01, 12, 22]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[-0.125, -0.12, 0.03]} rotation={[0, 0, Math.PI / 2.2]}>
            <torusGeometry args={[0.043, 0.009, 10, 18, Math.PI]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0.125, -0.12, 0.03]} rotation={[0, 0, -Math.PI / 2.2]}>
            <torusGeometry args={[0.043, 0.009, 10, 18, Math.PI]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
        </group>
      ) : null}

      {unlocked && type === "shield" ? (
        <group>
          <mesh position={[0, -0.26, 0.03]}>
            <cylinderGeometry args={[0.026, 0.03, 0.11, 16]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.11, 0.03]}>
            <boxGeometry args={[0.2, 0.2, 0.055]} />
            <meshStandardMaterial color="#2f3832" roughness={0.62} metalness={0.18} />
          </mesh>
          <mesh position={[0, -0.18, 0.075]}>
            <coneGeometry args={[0.09, 0.1, 6]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.1, 0.078]}>
            <boxGeometry args={[0.125, 0.11, 0.01]} />
            <meshStandardMaterial {...trimMaterial} />
          </mesh>
        </group>
      ) : null}

      {unlocked && type === "coin" ? (
        <group>
          <mesh position={[0, -0.27, 0.03]}>
            <cylinderGeometry args={[0.026, 0.03, 0.12, 14]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.2, 0.03]}>
            <boxGeometry args={[0.2, 0.02, 0.04]} />
            <meshStandardMaterial color="#38413a" roughness={0.7} metalness={0.16} />
          </mesh>
          <mesh position={[0, -0.08, 0.03]}>
            <boxGeometry args={[0.022, 0.16, 0.022]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.02, 0.03]}>
            <boxGeometry args={[0.11, 0.02, 0.022]} />
            <meshStandardMaterial color="#39423c" roughness={0.7} metalness={0.16} />
          </mesh>
          <mesh position={[0, -0.1, 0.07]}>
            <cylinderGeometry args={[0.078, 0.078, 0.03, 30]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.1, 0.085]}>
            <ringGeometry args={[0.03, 0.052, 22]} />
            <meshStandardMaterial {...trimMaterial} />
          </mesh>
        </group>
      ) : null}

      {unlocked && type === "star" ? (
        <group>
          <mesh position={[0, -0.26, 0.03]}>
            <cylinderGeometry args={[0.028, 0.034, 0.13, 18]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.1, 0.03]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          {[0, 1, 2, 3, 4].map((idx) => {
            const angle = (idx / 5) * Math.PI * 2;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * 0.056, -0.1 + Math.sin(angle) * 0.022, 0.085]}
                rotation={[Math.PI / 2.6, angle, 0]}
              >
                <coneGeometry args={[0.012, 0.055, 10]} />
                <meshStandardMaterial {...trimMaterial} />
              </mesh>
            );
          })}
          <mesh position={[0, -0.1, 0.098]}>
            <cylinderGeometry args={[0.015, 0.015, 0.038, 12]} />
            <meshStandardMaterial {...trimMaterial} />
          </mesh>
        </group>
      ) : null}

      {unlocked && type === "plaque" ? (
        <group>
          <mesh position={[0, -0.25, 0.03]}>
            <cylinderGeometry args={[0.025, 0.03, 0.11, 14]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          <mesh position={[0, -0.1, 0.03]}>
            <boxGeometry args={[0.24, 0.15, 0.06]} />
            <meshStandardMaterial color="#2f3732" roughness={0.66} metalness={0.14} />
          </mesh>
          <mesh position={[0, -0.1, 0.08]} rotation={[-0.22, 0, 0]}>
            <cylinderGeometry args={[0.074, 0.058, 0.18, 4]} />
            <meshStandardMaterial color="#9eada2" roughness={0.22} metalness={0.7} transparent opacity={0.92} />
          </mesh>
          <mesh position={[0, -0.165, 0.074]}>
            <boxGeometry args={[0.13, 0.026, 0.01]} />
            <meshStandardMaterial {...trimMaterial} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function LockerTrophy({
  achievement,
  position,
  selected,
  featured,
  onSelect,
}: {
  achievement: Achievement3D;
  position: [number, number];
  selected: boolean;
  featured: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const zTarget = selected ? 0.09 : featured ? 0.04 : 0.01;
    ref.current.position.z += (zTarget - ref.current.position.z) * 0.14;
    ref.current.rotation.y += ((selected ? 0.06 : 0) - ref.current.rotation.y) * 0.12;
  });

  return (
    <group ref={ref} position={[position[0], position[1] + 0.02, 0.01]} onPointerDown={onSelect} scale={featured ? 1.16 : 1}>
      <TrophyShape type={achievement.shape} unlocked={achievement.unlocked} selected={selected} featured={featured} />
    </group>
  );
}

function LockerCabinet() {
  return (
    <group>
      <mesh position={[0, 0, -0.14]}>
        <boxGeometry args={[3.82, 2.52, 0.1]} />
        <meshStandardMaterial color="#222822" roughness={0.86} metalness={0.12} />
      </mesh>

      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[3.74, 2.44, 0.02]} />
        <meshStandardMaterial color="#5d685f" roughness={0.58} metalness={0.24} />
      </mesh>

      <mesh position={[-1.86, 0, -0.12]}>
        <boxGeometry args={[0.1, 2.46, 0.12]} />
        <meshStandardMaterial {...mat.trim} />
      </mesh>
      <mesh position={[1.86, 0, -0.12]}>
        <boxGeometry args={[0.1, 2.46, 0.12]} />
        <meshStandardMaterial {...mat.trim} />
      </mesh>
      <mesh position={[0, 1.2, -0.12]}>
        <boxGeometry args={[3.82, 0.1, 0.12]} />
        <meshStandardMaterial {...mat.trim} />
      </mesh>
      <mesh position={[0, -1.2, -0.12]}>
        <boxGeometry args={[3.82, 0.1, 0.12]} />
        <meshStandardMaterial {...mat.trim} />
      </mesh>

      <mesh position={[-0.63, 0, -0.12]}>
        <boxGeometry args={[0.08, 2.28, 0.12]} />
        <meshStandardMaterial color="#49564c" roughness={0.67} metalness={0.22} />
      </mesh>
      <mesh position={[0.63, 0, -0.12]}>
        <boxGeometry args={[0.08, 2.28, 0.12]} />
        <meshStandardMaterial color="#49564c" roughness={0.67} metalness={0.22} />
      </mesh>
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[3.72, 0.08, 0.12]} />
        <meshStandardMaterial color="#49564c" roughness={0.67} metalness={0.22} />
      </mesh>

      {[
        [-1.24, 0.57],
        [0, 0.57],
        [1.24, 0.57],
        [-1.24, -0.57],
        [0, -0.57],
        [1.24, -0.57],
      ].map((pos, idx) => (
        <group key={idx}>
          <mesh position={[pos[0], pos[1], -0.165]}>
            <boxGeometry args={[1.12, 1.03, 0.09]} />
            <meshStandardMaterial color="#141914" roughness={0.9} metalness={0.02} />
          </mesh>
          <mesh position={[pos[0], pos[1], -0.125]}>
            <boxGeometry args={[1.04, 0.95, 0.01]} />
            <meshStandardMaterial color="#262d27" roughness={0.78} metalness={0.08} />
          </mesh>
          <mesh position={[pos[0], pos[1] - 0.495, -0.1]}>
            <boxGeometry args={[1.06, 0.04, 0.08]} />
            <meshStandardMaterial color="#4e5a50" roughness={0.62} metalness={0.2} />
          </mesh>
          <mesh position={[pos[0], pos[1] + 0.495, -0.1]}>
            <boxGeometry args={[1.06, 0.03, 0.07]} />
            <meshStandardMaterial color="#3f4a42" roughness={0.66} metalness={0.16} />
          </mesh>
        </group>
      ))}

      <mesh position={[1.72, 0.02, -0.02]}>
        <boxGeometry args={[0.05, 1.96, 0.03]} />
        <meshStandardMaterial color="#6a756c" roughness={0.45} metalness={0.4} />
      </mesh>
    </group>
  );
}

export default function AchievementLocker3D({ achievements, selectedId, onSelect }: AchievementLocker3DProps) {
  const slots: [number, number][] = [
    [-1.24, 0.57],
    [0, 0.57],
    [1.24, 0.57],
    [-1.24, -0.57],
    [0, -0.57],
    [1.24, -0.57],
  ];

  const featuredId = useMemo(
    () => achievements.find((a) => a.rarity === "elite" && a.unlocked)?.id ?? achievements[0]?.id,
    [achievements]
  );

  return (
    <JourneyCanvas className="h-64" cameraPosition={[0, 0, 4.45]} orthographic zoom={116}>
      <group position={[0, -0.08, 0]}>
        <LockerCabinet />

        {achievements.slice(0, 6).map((achievement, idx) => (
          <LockerTrophy
            key={achievement.id}
            achievement={achievement}
            position={slots[idx] ?? [0, 0]}
            selected={achievement.id === selectedId}
            featured={achievement.id === featuredId}
            onSelect={() => onSelect(achievement.id)}
          />
        ))}
      </group>
    </JourneyCanvas>
  );
}

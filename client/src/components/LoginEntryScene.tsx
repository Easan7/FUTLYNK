import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LoginEntryScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 120);
    camera.position.set(0, 8.8, 10.5);
    camera.lookAt(0, 0.6, 0);

    const ambient = new THREE.AmbientLight("#9ad0ff", 0.42);
    const key = new THREE.PointLight("#a8ff3f", 2.0, 60, 2);
    key.position.set(-5, 8, 5);
    const cyan = new THREE.PointLight("#37d3ff", 1.55, 55, 2);
    cyan.position.set(6, 5, 8);
    const rim = new THREE.PointLight("#79ff4e", 0.9, 35, 2);
    rim.position.set(0, 2, -8);
    scene.add(ambient, key, cyan, rim);

    const boardMat = new THREE.MeshStandardMaterial({
      color: "#0b1521",
      metalness: 0.28,
      roughness: 0.72,
    });
    const board = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 25), boardMat);
    board.rotation.x = -Math.PI / 2.08;
    board.position.y = -1.15;
    scene.add(board);

    const lineMat = new THREE.LineBasicMaterial({ color: "#4bddff", transparent: true, opacity: 0.7 });
    const accentMat = new THREE.LineBasicMaterial({ color: "#a8ff3f", transparent: true, opacity: 0.92 });

    const pitch = new THREE.Group();
    pitch.rotation.x = -Math.PI / 2.08;
    pitch.position.y = -1.02;

    const w = 11.8;
    const h = 18.8;

    const border = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-w / 2, -h / 2, 0),
        new THREE.Vector3(w / 2, -h / 2, 0),
        new THREE.Vector3(w / 2, h / 2, 0),
        new THREE.Vector3(-w / 2, h / 2, 0),
      ]),
      lineMat
    );

    const halfLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-w / 2, 0, 0),
        new THREE.Vector3(w / 2, 0, 0),
      ]),
      lineMat
    );

    const boxBottom = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.9, -h / 2, 0),
        new THREE.Vector3(2.9, -h / 2, 0),
        new THREE.Vector3(2.9, -h / 2 + 2.8, 0),
        new THREE.Vector3(-2.9, -h / 2 + 2.8, 0),
      ]),
      lineMat
    );
    const boxTop = boxBottom.clone();
    boxTop.rotation.z = Math.PI;

    pitch.add(border, halfLine, boxBottom, boxTop);

    const laneGeometries: THREE.BufferGeometry[] = [];
    const lanes: THREE.Line[] = [];
    const lanePaths = [
      [
        new THREE.Vector3(-4.8, -7.8, 0),
        new THREE.Vector3(-2.2, -5.3, 0),
        new THREE.Vector3(1.5, -2.6, 0),
        new THREE.Vector3(4.0, -0.1, 0),
      ],
      [
        new THREE.Vector3(4.4, -6.5, 0),
        new THREE.Vector3(1.8, -3.8, 0),
        new THREE.Vector3(-1.4, -1.2, 0),
        new THREE.Vector3(-4.1, 2.3, 0),
      ],
      [
        new THREE.Vector3(-3.5, 1.8, 0),
        new THREE.Vector3(-0.4, 3.9, 0),
        new THREE.Vector3(2.3, 6.0, 0),
      ],
    ];

    for (const pts of lanePaths) {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      laneGeometries.push(geo);
      const line = new THREE.Line(geo, accentMat);
      lanes.push(line);
      pitch.add(line);
    }

    const nodeGeom = new THREE.SphereGeometry(0.18, 18, 18);
    const nodeData = [
      [-4.8, -7.8, "#a8ff3f"],
      [-2.2, -5.3, "#3fd7ff"],
      [1.5, -2.6, "#a8ff3f"],
      [4.0, -0.1, "#3fd7ff"],
      [4.4, -6.5, "#a8ff3f"],
      [1.8, -3.8, "#3fd7ff"],
      [-1.4, -1.2, "#a8ff3f"],
      [-4.1, 2.3, "#3fd7ff"],
      [-3.5, 1.8, "#a8ff3f"],
      [-0.4, 3.9, "#3fd7ff"],
      [2.3, 6.0, "#a8ff3f"],
      [0.0, 8.1, "#3fd7ff"],
    ] as const;

    const nodes: THREE.Mesh[] = [];
    for (const [x, y, color] of nodeData) {
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.86,
        roughness: 0.3,
        metalness: 0.22,
      });
      const node = new THREE.Mesh(nodeGeom, mat);
      node.position.set(x, y, 0.25);
      nodes.push(node);
      pitch.add(node);
    }

    scene.add(pitch);

    const haloMat = new THREE.MeshBasicMaterial({ color: "#1ed4ff", transparent: true, opacity: 0.12 });
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), haloMat);
    halo.position.set(0, 4, -9);
    scene.add(halo);

    const particlesGeom = new THREE.BufferGeometry();
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 36;
      positions[i3 + 1] = Math.random() * 16 - 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
    }
    particlesGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({ color: "#9ad3ff", size: 0.035, transparent: true, opacity: 0.52 });
    const particles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particles);

    const start = performance.now();
    let raf = 0;

    const animate = () => {
      const t = (performance.now() - start) / 1000;

      camera.position.x = Math.sin(t * 0.2) * 0.75;
      camera.position.y = 8.5 + Math.cos(t * 0.16) * 0.26;
      camera.lookAt(0, 0.55, 0);

      lanes.forEach((lane, idx) => {
        lane.material.opacity = 0.45 + Math.sin(t * 2.1 + idx) * 0.25;
      });

      nodes.forEach((node, idx) => {
        const pulse = 0.9 + Math.sin(t * 2.4 + idx * 0.45) * 0.24;
        node.scale.setScalar(pulse);
      });

      particles.rotation.y = t * 0.03;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);

      renderer.dispose();
      board.geometry.dispose();
      boardMat.dispose();
      lineMat.dispose();
      accentMat.dispose();
      nodeGeom.dispose();
      nodes.forEach((n) => (n.material as THREE.Material).dispose());
      laneGeometries.forEach((g) => g.dispose());
      border.geometry.dispose();
      halfLine.geometry.dispose();
      boxBottom.geometry.dispose();
      boxTop.geometry.dispose();
      halo.geometry.dispose();
      haloMat.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

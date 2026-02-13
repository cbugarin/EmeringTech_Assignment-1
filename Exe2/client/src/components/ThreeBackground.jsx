import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function FloatingRing() {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;

    //rotate 
    ref.current.rotation.y += delta * 0.2;
    ref.current.rotation.x += delta * 0.1;

    //pulse effect
    const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.03;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={ref} position={[0, -0.5, 0]}>
      <torusGeometry args={[1.8, 0.4, 32, 100]} />
      <meshStandardMaterial
       color="#00e5ff"
  metalness={0.4}
  roughness={0.3}
  transparent
  opacity={0.25}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const pointsRef = useRef();

  const particles = new Array(300).fill().map(() => (
    (Math.random() - 0.5) * 10
  ));

  const positions = new Float32Array(particles);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00ffff" opacity={0.5} transparent />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <FloatingRing />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

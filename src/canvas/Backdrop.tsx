import { useRef } from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { RandomizedLight, AccumulativeShadows } from "@react-three/drei";

const Backdrop = () => {
  const shadows = useRef();

  return (
    <AccumulativeShadows
      position={[0, 0, -0.14]}
      temporal
      frames={60}
      alphaTest={0.35}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      ref={shadows}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.55}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;

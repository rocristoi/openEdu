import React, { useRef } from 'react';
import { Text3D, Center } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';


const Number = ({number}) => {
    const numberRef = useRef();

    useFrame((state) => {
      const elapsedTime = state.clock.getElapsedTime();
  
      const levitationHeight = Math.sin(elapsedTime * 2) * 0.5;
  
      if (numberRef.current) {
        numberRef.current.position.y = levitationHeight;
      }
    });
  
    return (
        <Center>
            <Text3D
            ref={numberRef}
            font="/fonts/Poppins Black_Regular.json"
            size={1}
            height={0.2}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.02}
            bevelSegments={8}
            scale={[3, 3, 3]} 
            >
            {number}
            <meshBasicMaterial color="#23c55e" 
            toneMapped={false} // Ensures no lighting effect

            /> {/* Basic material, ignores lights */}
            </Text3D>
            </Center>
    );
  };
    export default Number;
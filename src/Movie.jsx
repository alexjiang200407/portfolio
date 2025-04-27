import React, { useEffect, useRef } from "react";
import Footer from "./UI/Footer";
import Header from "./UI/Header";
import Signature from './Signature';
import DavidBust from './models/DavidBust';
import { Html, ScrollControls, Stats } from '@react-three/drei';
import './App.css'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, N8AO, Noise } from "@react-three/postprocessing"
import UI from "./UI/UI";



const showStats = process.env.NODE_ENV !== 'production';

function FillLight() {
  const fillLight = useRef();

  useFrame((state, delta) => {
    const parallaxX = (state.pointer.x * 0.5);
    const parallaxY = (state.pointer.y * 0.5);
    fillLight.current.position.y += (parallaxY * 8 - fillLight.current.position.y + 2) * delta
    fillLight.current.position.x += (parallaxX * 8 - fillLight.current.position.x) * 2 * delta
  })

  return (
    <pointLight
      color={0xffffff}
      intensity={5}
      distance={4}
      decay={3}
      ref={fillLight}
    />
  );
}


function Gfx({ assetsMap }) {
  return (
    <>
      <group>
        <ScrollControls
          pages={3}
          damping={0.25}
        >
          <DavidBust
            assetsMap={assetsMap}
          />
          <FillLight />
          <spotLight
            position={[-5, 0, -5]}
            angle={0.3}
            penumbra={0.5}
            intensity={3.5}
            castShadow
          />
          <Signature
            fontSize={2}
            position={[0, 0, -2.5]}
            font='./signature.woff'
          >
            Alex Jiang
          </Signature>
          <Signature
            fontSize={.15}
            position={[0, -.45, -1.2]}
            font='./BridgetLily.woff'
          >
            Memento Mori
          </Signature>
        </ScrollControls>
      </group>
    </>
  )
}


export default function Movie({assetsMap}) {

  return (
    <div
      style={{
        // zIndex: 100,
        color: 'white',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '100vh',
      }}
    >
      <Canvas
        id='three'
        dpr={[1, 2]}
        camera={{ position: [0, 0, 0] }}
        gl={{
          physicallyCorrectLights: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        {showStats && <Stats />}
        <color attach="background" args={[0x080808]} />
        <Gfx assetsMap={assetsMap} />
        <UI />
        <EffectComposer>
          <N8AO color="black" aoRadius={2} intensity={1.15} />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
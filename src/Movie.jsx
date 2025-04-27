import { Environment, Html, Stats } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, N8AO, Noise } from '@react-three/postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'
import DavidBust from './models/DavidBust'
import './App.css'

const SHOW_STATS = true

function FillLight() {
  const fillLight = useRef()

  useFrame((state, delta) => {
    const parallaxX = (state.pointer.x * 0.5)
    const parallaxY = (state.pointer.y * 0.5)
    fillLight.current.position.y += (parallaxY * 8 - fillLight.current.position.y + 2) * delta
    fillLight.current.position.x += (parallaxX * 8 - fillLight.current.position.x) * 2 * delta
  })

  return (
    <pointLight
      color={0xFFFFFF}
      intensity={5}
      distance={4}
      decay={3}
      ref={fillLight}
    />
  )
}

function Gfx({ assetsMap }) {
  return (
    <>
      <group>
        <DavidBust
          assetsMap={assetsMap}
        />
        <FillLight />
        <spotLight
          position={[-5, 0, -5]}
          angle={0.3}
          penumbra={0.5}
          intensity={15.0}
          castShadow
        />
      </group>
    </>
  )
}

export default function Movie({ assetsMap }) {
  return (
    <div
      style={{
        color: 'white',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '100vh',
      }}
    >
      <Canvas
        id="three"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 0] }}
        gl={{
          physicallyCorrectLights: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        {SHOW_STATS && <Stats />}
        <color attach="background" args={[0x080808]} />
        <Gfx assetsMap={assetsMap} />
        <Html
          className="three-ui"
          style={{
            width: '100vw',
            height: '100vh',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '3vh',
              width: '100%',
              fontSize: '2rem',
              textAlign: 'center',
              fontFamily: 'SaolDisplay',
            }}
          >
            <h1>ALEX JIANG</h1>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '8vh',
              width: '100%',
              fontSize: '2rem',
              textAlign: 'center',
              fontFamily: 'SaolDisplay',
            }}
          >
            <h3>Designer & Programmer</h3>
            <h4 style={{ fontSize: '1rem' }}>Based in Sydney, Australia</h4>
          </div>
        </Html>
        <EffectComposer>
          <N8AO color="black" aoRadius={2} intensity={1.15} />
          <Bloom luminanceTheshold={1} intensity={0.3} mipMapBlur />
          <Noise opacity={0.03} />
        </EffectComposer>
        <Environment preset='night' intensity={0.3}/>
      </Canvas>
    </div>
  )
}

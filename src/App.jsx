import { ContactShadows, Environment, OrbitControls, Stats } from '@react-three/drei';
import './App.css'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing"
import { OBJLoader } from 'three-stdlib'

function Model(props) {
  const obj = useLoader(OBJLoader, '/rapid.obj')
  const material = new THREE.MeshStandardMaterial({
    normalMap: useLoader(THREE.TextureLoader, '/material0_normal.jpg'),
    aoMap: useLoader(THREE.TextureLoader, '/material0_occlusion.jpg'),
  });

  obj.children[0].material = material;
    
  return <primitive object={obj} {...props} />
}

const showStats = true;
const cursor = {
  x:0,
  y:0
};

function FillLight() {
  const {scene} = useThree()
  const fillLight = new THREE.PointLight(0xffffff, 5, 4, 3) 

  useEffect(() => {
    scene.add(fillLight)
  }, [])

  useFrame((state, delta) => {
    const parallaxY = cursor.y
    fillLight.position.y -= ( parallaxY *9 + fillLight.position.y -2) * delta

    const parallaxX = cursor.x
    fillLight.position.x += (parallaxX *8 - fillLight.position.x) * 2 * delta

    state.camera.position.z -= (parallaxY/3 + state.camera.position.z) * 2 * delta
    state.camera.position.x += (parallaxX/3 - state.camera.position.x) * 2 * delta
  })

  return null
}


function App() {
  useEffect(() => {
    // window.addEventListener('keydown', handleKeyPress)

    document.addEventListener('mousemove', (event) => {
      event.preventDefault()
      cursor.x = event.clientX / window.innerWidth -0.5
      cursor.y = event.clientY / window.innerHeight -0.5
    }, false)
  

  }, [])
  
  return (
    <Canvas
      dpr={[1, 2]} style={{ height: '100vh', width: '100vw' }}
      camera={{ position: [0, 0, 0] }}
      gl={{
        physicallyCorrectLights: true,
        outputEncoding: THREE.sRGBEncoding,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      {showStats && <Stats />}
      <color attach="background" args={['black']} />
      <Model />
      <FillLight />
      <spotLight  
        position={[-5, 0, -5]}
        angle={0.3}
        penumbra={0.5}
        intensity={3.5}
        castShadow
      />
      {/* <Environment files="/adamsbridge.hdr" /> */}
      <EffectComposer>
        <N8AO color="black" aoRadius={2} intensity={1.15} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={1} />
      </EffectComposer>
    </Canvas>
  );
}

export default App

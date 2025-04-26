import { Stats, Text, Text3D } from '@react-three/drei';
import './App.css'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { EffectComposer, N8AO, Noise } from "@react-three/postprocessing"
import { Font, FontLoader, OBJLoader, TextGeometry, TTFLoader } from 'three-stdlib'
import LoadingScreen from './Loader';
import UI from './UI/UI';
import Signature from './Signature';

function Model({ assetsMap }) {
  const obj = assetsMap['rapid.obj']
  const material = new THREE.MeshStandardMaterial({
    normalMap: assetsMap['material0_normal.jpg'],
    aoMap: assetsMap['material0_occlusion.jpg'],
  });
  obj.children[0].material = material;

  return <primitive object={obj} />
}

const showStats = process.env.NODE_ENV !== 'production' && false;

function FillLight() {
  const fillLight = useRef();

  useFrame((state, delta) => {
    console.log(state.pointer)
    const parallaxX = (state.pointer.x * 0.5);  // Already normalized by R3F
    const parallaxY = (state.pointer.y * 0.5);  // Already normalized by R3F
    fillLight.current.position.y += (parallaxY * 8 - fillLight.current.position.y + 2) * delta
    fillLight.current.position.x += (parallaxX * 8 - fillLight.current.position.x) * 2 * delta

    state.camera.position.z += (parallaxY / 3 - state.camera.position.z) * 2 * delta
    state.camera.position.x += (parallaxX / 3 - state.camera.position.x) * 2 * delta
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
const assets = {
  'rapid.obj': OBJLoader,
  'material0_normal.jpg': THREE.TextureLoader,
  'material0_occlusion.jpg': THREE.TextureLoader,
}

function Movie({ assetsMap }) {
  return (
    <>
      <group>
        <Model assetsMap={assetsMap} />
        {<FillLight />}
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
      </group>
    </>
  )
}

function App() {
  const [assetsMap, setAssetMap] = useState(null);

  useEffect(() => {
    Promise.all(Object.entries(assets).map(([key, loader]) => new Promise(resolve => new loader()
      .load(key, asset => resolve({ [key]: asset }))))
    )
      .then(data => {
        setAssetMap(data.reduce((acc, obj) => {
          Object.entries(obj).forEach(([a, b]) => {
            acc[a] = b;
          });
          return acc;
        }, {}))
      })
  }, [])
  
  return (
    <div>
      <LoadingScreen hidden={assetsMap !== null}>
        <UI >
        <Canvas
          id='three'
          dpr={[1, 2]}
          style={{
            height: '100vh',
            width: '100%',
            position: 'fixed',
            top: 0, left: 0,
            zIndex: 0,
          }}
          camera={{ position: [0, 0, 0] }}
          gl={{
            physicallyCorrectLights: true,
            outputEncoding: THREE.sRGBEncoding,
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          {showStats && <Stats />}
          <color attach="background" args={[0x080808]} />
          <Movie assetsMap={assetsMap}  />
          <EffectComposer>
            <N8AO color="black" aoRadius={2} intensity={1.15} />
            <Noise opacity={0.03} />
          </EffectComposer>
        </Canvas>
        </UI>
      </LoadingScreen>
    </div>
  );
}

export default App

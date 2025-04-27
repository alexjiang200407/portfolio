import { Html, ScrollControls, Stats } from '@react-three/drei';
import './App.css'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { createElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EffectComposer, N8AO, Noise } from "@react-three/postprocessing"
import { CSS2DObject, CSS2DRenderer, CSS3DObject, OBJLoader } from 'three-stdlib'
import LoadingScreen from './Loader';
import Movie from './Movie';




const assets = {
  'rapid.obj': OBJLoader,
  'material0_normal.jpg': THREE.TextureLoader,
  'material0_occlusion.jpg': THREE.TextureLoader,
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
        <Movie assetsMap={assetsMap}/>
        <div>Hello World</div>
      </LoadingScreen>
    </div>
  );
}

export default App

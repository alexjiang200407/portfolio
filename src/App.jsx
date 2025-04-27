import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three-stdlib'
import LoadingScreen from './Loader'
import Movie from './Movie'
import './App.css'

const assets = {
  'rapid.obj': OBJLoader,
  'material0_normal.jpg': THREE.TextureLoader,
  'material0_occlusion.jpg': THREE.TextureLoader,
}

function App() {
  const [assetsMap, setAssetMap] = useState(null)
  useEffect(() => {
    Promise.all(Object.entries(assets).map(([key, Loader]) => new Promise(resolve => new Loader()
      .load(key, asset => resolve({ [key]: asset })))),
    )
      .then((data) => {
        setAssetMap(data.reduce((acc, obj) => {
          Object.entries(obj).forEach(([a, b]) => {
            acc[a] = b
          })
          return acc
        }, {}))
      })
  }, [])

  return (
    <div>
      <LoadingScreen hidden={assetsMap !== null}>
        <Movie assetsMap={assetsMap} />
        <div>Hello World</div>
      </LoadingScreen>
    </div>
  )
}

export default App

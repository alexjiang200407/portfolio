import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three'

function DavidBust({ assetsMap }) {
  const obj = assetsMap['rapid.obj']
  const material = new THREE.MeshStandardMaterial({
    normalMap: assetsMap['material0_normal.jpg'],
    aoMap: assetsMap['material0_occlusion.jpg'],
  });
  obj.children[0].material = material;

  const tl = useRef(null)
  const scroll = useScroll()
  const ref = useRef(null)

  useFrame(() => {
    if (tl.current) tl.current.seek(scroll.offset * 4 * tl.current.duration())
  })

  useEffect(() => {
    ref.current.children[0].geometry.center()
  }, [ref.current])

  useLayoutEffect(() => {
    tl.current = gsap.timeline()
    // ref.current.quaternion.set(0, 0, 0, 1)
    // ref.current.rotation.set(0, 0, 0) // Explicitly reset
    // ref.current.updateMatrixWorld() // Ensure matrix is updated

    tl.current
      .fromTo(
        ref.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: -Math.PI / 15,
        y: -Math.PI / 8,
        z: 0,
        duration: 1,
        ease: 'power2.out',
      },
    )
    .fromTo(
      ref.current.position,
      {
        x: 0,
        y: 0,
        z: -2,
      },
      {
        x: .0,
        y: .0,
        z: -2.25,
        duration: 1,
        ease: 'power2.out',
      },
      0
    )  
  }, [])



  return <primitive position={[0, 0, -2]} ref={ref} object={obj} />
}


export default DavidBust
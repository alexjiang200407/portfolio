import { useCursor, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
// import { pageAtom, pages } from "./UI";
import gsap from 'gsap'
import { useAtom } from 'jotai'
import { easing } from 'maath'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import { pageAtom, pages } from '../globals'

const easingFactor = 0.5 // Controls the speed of the easing
const easingFactorFold = 0.3 // Controls the speed of the easing
const insideCurveStrength = 0.18 // Controls the strength of the curve
const outsideCurveStrength = 0.05 // Controls the strength of the curve
const turningCurveStrength = 0.09 // Controls the strength of the curve

const PAGE_WIDTH = 1.28
const PAGE_HEIGHT = 1.71 // 4:3 aspect ratio
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2,
)

const pictures = [
  'DSC00680.jpg',
  'DSC00933.jpg',
  'DSC00966.jpg',
  'DSC00983.jpg',
  'DSC01011.jpg',
  'DSC01040.jpg',
  'DSC01064.jpg',
  'DSC01071.jpg',
  'DSC01103.jpg',
  'DSC01145.jpg',
  'DSC01420.jpg',
  'DSC01461.jpg',
]

pages.push({
  front: 'book-cover.jpg',
  back: pictures[0],
})

for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  })
}

pages.push({
  front: pictures[pictures.length - 1],
  back: 'book-back.jpg',
})

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

const position = pageGeometry.attributes.position
const vertex = new Vector3()
const skinIndexes = []
const skinWeights = []

for (let i = 0; i < position.count; i++) {
  // ALL VERTICES
  vertex.fromBufferAttribute(position, i) // get the vertex
  const x = vertex.x // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)) // calculate the skin index
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH // calculate the skin weight

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0) // set the skin indexes
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0) // set the skin weights
}

pageGeometry.setAttribute(
  'skinIndex',
  new Uint16BufferAttribute(skinIndexes, 4),
)
pageGeometry.setAttribute(
  'skinWeight',
  new Float32BufferAttribute(skinWeights, 4),
)

const whiteColor = new Color('white')
const emissiveColor = new Color('orange')

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: '#111',
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
]

pages.forEach((page) => {
  useTexture.preload(`/textures/${page.front}`)
  useTexture.preload(`/textures/${page.back}`)
  useTexture.preload(`/textures/book-cover-roughness.jpg`)
})

function Page({ number, front, back, page, opened, bookClosed, ...props }) {
  const [picture, picture2, pictureRoughness] = useTexture([
    `/textures/${front}`,
    `/textures/${back}`,
    ...(number === 0 || number === pages.length - 1
      ? [`/textures/book-cover-roughness.jpg`]
      : []),
  ])
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace
  const group = useRef()
  const turnedAt = useRef(0)
  const lastOpened = useRef(opened)
  const skinnedMeshRef = useRef()
  const [, setPage] = useAtom(pageAtom)
  const [highlighted, setHighlighted] = useState(false)
  useCursor(highlighted)

  const manualSkinnedMesh = useMemo(() => {
    const bones = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone()
      bones.push(bone)
      if (i === 0) {
        bone.position.x = 0
      }
      else {
        bone.position.x = SEGMENT_WIDTH
      }
      if (i > 0) {
        bones[i - 1].add(bone) // attach the new bone to the previous bone
      }
    }
    const skeleton = new Skeleton(bones)

    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture,
        ...(number === 0
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,
        ...(number === pages.length - 1
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ]
    const mesh = new SkinnedMesh(pageGeometry, materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)
    return mesh
  }, [number, picture, picture2, pictureRoughness])

  // useHelper(skinnedMeshRef, SkeletonHelper, "red");

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return
    }

    const emissiveIntensity = highlighted ? 0.22 : 0
    skinnedMeshRef.current.material[4].emissiveIntensity
      = skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1,
      )

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date()
      lastOpened.current = opened
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8)
    }

    const bones = skinnedMeshRef.current.skeleton.bones
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i]

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
      const turningIntensity
        = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime
      let rotationAngle
        = insideCurveStrength * insideCurveIntensity * targetRotation
          - outsideCurveStrength * outsideCurveIntensity * targetRotation
          + turningCurveStrength * turningIntensity * targetRotation
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2)
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation
          foldRotationAngle = 0
        }
        else {
          rotationAngle = 0
          foldRotationAngle = 0
        }
      }
      easing.dampAngle(
        target.rotation,
        'y',
        rotationAngle,
        easingFactor,
        delta,
      )

      const foldIntensity
        = i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0
      easing.dampAngle(
        target.rotation,
        'x',
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta,
      )
    }
  })

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHighlighted(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHighlighted(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setPage(opened ? number : number + 1)
        setHighlighted(false)
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-x={0}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  )
}

export function Book({ ...props }) {
  const [page] = useAtom(pageAtom)
  const [delayedPage, setDelayedPage] = useState(page)
  const { viewport } = useThree()
  const ref = useRef(null)

  useEffect(() => {
    let timeout
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === 0) {
          gsap.to(ref.current.position, {
            x: -0.6,
          })
        }
        else if (page === pages.length) {
          gsap.to(ref.current.position, {
            x: 0.6,
          })
        }
        else {
          gsap.to(ref.current.position, {
            x: 0,
          })
        }
        if (page === delayedPage) {
          return delayedPage
        }
        else {
          timeout = setTimeout(
            () => {
              goToPage()
            },
            Math.abs(page - delayedPage) > 2 ? 50 : 150,
          )
          if (page > delayedPage) {
            return delayedPage + 1
          }
          if (page < delayedPage) {
            return delayedPage - 1
          }
        }
      })
    }
    requestAnimationFrame(() => goToPage())
    return () => {
      clearTimeout(timeout)
    }
  }, [page])

  return (
    <group {...props} ref={ref} rotation-y={-Math.PI / 2.1} position-z={window.innerWidth < 768 ? -2.5 : 1} position-y={-viewport.height * 2 + 0.5}>
      {[...pages].map((pageData, index) => (
        <Page
          key={pageData.front + pageData.back}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          {...pageData}
        />
      ))}
    </group>
  )
}

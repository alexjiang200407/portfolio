import { Float, Text } from "@react-three/drei"

function Signature({ ...props }) {
  return (
    <Float
      speed={5}
      rotationIntensity={0.05}
      floatIntensity={0.05}
      floatingRange={[0.01, 0.02]}
    >
      <Text
        {...props}
      />
    </Float>
  )
}

export default Signature

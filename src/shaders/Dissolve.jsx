import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise";
import * as React from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition; // use the world position instead of the uv
  void main() {
    vUv = uv;
    vPosition = position;
  }`;

const fragmentShader = patchShaders(/* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uThickness;
  uniform vec3 uColor;
  uniform float uProgress;
  
  
  void main() {
    gln_tFBMOpts opts = gln_tFBMOpts(68.0, 0.3, 2.0, 2.0, 1.0, 2, false, false);
    //float noise = gln_sfbm(vUv, opts); // THE ORIGINAL CODE FROM THE TUTORIAL
    float noise = gln_sfbm(vPosition, opts); //  use the world position instead of the uv for a better effect working on all objects
    noise = gln_normalize(noise);

    float progress = uProgress;

    float alpha = step(1.0 - progress, noise);
    float border = step((1.0 - progress) - uThickness, noise) - alpha;
    
    csm_DiffuseColor.a = alpha;
    csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColor, border);
  }`);

  const Dissolve = React.forwardRef(({
    baseMaterial,
    thickness = 0.1,
    color = "#eb5a13",
    intensity = 50,
    onFadeOut,
  }, ref) => {
    const uniforms = React.useRef({
      uThickness: { value: thickness },
      uColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
      uProgress: { value: 0 },
    });
  
    // Expose uniforms ref to parent
    React.useImperativeHandle(ref, () => uniforms.current);
  
    useFrame(() => {
      if (uniforms.current.uProgress.value < 0.1 && onFadeOut) {
        onFadeOut();
      }
    });
  
    return (
      <CSM
        baseMaterial={baseMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        toneMapped={false}
        transparent
      />
    );
  });
  
  export default Dissolve;
import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF, Html, Float} from '@react-three/drei'

import ReactMarkdown from 'react-markdown';
import { useCursor, MeshReflectorMaterial} from '@react-three/drei'

// Loads All other components into main app for export
export default function App() {

  // Model transformation parameters
  const rotation = [0, Math.PI - 0.4, 0];
  const position = [-1.2, 0, 0.6];
  const scale = [0.26, 0.26, 0.26];

  return (
    <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 3, 100], fov: 15 }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>

          {modelLoad({rotation, position, scale})}
          <VideoText position={[0, 1.3, -2]} />
          {setPlane()}
          <Ground />
        </group>

        <ambientLight intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        <directionalLight position={[-50, 0, -40]} intensity={0.7} />

        <Intro />
      </Suspense>
    </Canvas>
  )
}

// Loads the 3D model
function modelLoad(props) {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} {...props} />
}

// Load the Video texture text
function VideoText(props) {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/test.mp4', crossOrigin: 'Anonymous', loop: true, muted: true }))
  useEffect(() => void video.play(), [video])
  return (
    <Text font="/Inter-Bold.woff" fontSize={1.75} letterSpacing={-0.1} {...props}>
      SKSTUDIO
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
      </meshBasicMaterial>
    </Text>
  )
}

// Set the reflective ground material
function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])

  return (
    <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
    </Reflector>
  )
}

// LERP with scroll motion
function Intro() {
  const [vec] = useState(() => new THREE.Vector3())
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}

// Set Text on Plane Meshes
function setText() {
  return (
    <Html
      transform
      wrapperClass="htmlScreen"
      distanceFactor={ 0 }
      position={ [-2, 1.2, 0] }
      rotation-x={ 0 }
      rotation-y={ Math.PI / 5}
      scale= { [ 0.5, 0.5, 0.5 ] }
  >
    <div className='planeText'>
    Yooo what up this is html itself
    {/* <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="106" height="28" role="img" aria-label="THREE.JS"><title>THREE.JS</title><g shape-rendering="crispEdges"><rect width="106" height="28" fill="#6592e6"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100"><image x="9" y="7" width="14" height="14" xlink:href="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+VGhyZWUuanM8L3RpdGxlPjxwYXRoIGQ9Ik0uMzggMGEuMjY4LjI2OCAwIDAgMC0uMjU2LjMzMmwyLjg5NCAxMS43MTZhLjI2OC4yNjggMCAwIDAgLjAxLjA0bDIuODkgMTEuNzA4YS4yNjguMjY4IDAgMCAwIC40NDcuMTI4TDIzLjgwMiA3LjE1YS4yNjguMjY4IDAgMCAwLS4xMTItLjQ1bC01Ljc4NC0xLjY2N2EuMjY4LjI2OCAwIDAgMC0uMTIzLS4wMzVMNi4zOCAxLjcxNWEuMjY4LjI2OCAwIDAgMC0uMTQ0LS4wNEwuNDU2LjAxQS4yNjguMjY4IDAgMCAwIC4zOCAwem0uMzc0LjY1NEw1LjcxIDIuMDggMS45OSA1LjY2NHpNNi42MSAyLjM0bDQuODY0IDEuNC0zLjY1IDMuNTE1em0tLjUyMi4xMmwxLjIxNyA0LjkyNi00Ljg3Ny0xLjR6bTYuMjggMS41MzhsNC44NzggMS40MDQtMy42NjIgMy41M3ptLS41Mi4xM2wxLjIwOCA0LjktNC44NTMtMS4zOTJ6bTYuMyAxLjUzNGw0Ljk0NyAxLjQyNC0zLjcxNSAzLjU3NHptLS41MjQuMTJsMS4yMTUgNC45MjYtNC44NzYtMS4zOTh6bS0xNS40MzIuNjk2bDQuOTY0IDEuNDI0LTMuNzI2IDMuNTg2ek04LjA0NyA4LjE1bDQuODc3IDEuNC0zLjY2IDMuNTI3em0tLjUxOC4xMzdsMS4yMzYgNS4wMTctNC45NjMtMS40MzJ6bTYuMjc0IDEuNTM1bDQuOTY1IDEuNDI1LTMuNzMgMy41ODZ6bS0uNTIuMTI3bDEuMjM1IDUuMDEyLTQuOTU4LTEuNDN6bS05LjYzIDIuNDM4bDQuODczIDEuNDA2LTMuNjU2IDMuNTIzem01Ljg1NCAxLjY4N2w0Ljg2MyAxLjQwMy0zLjY0OCAzLjUxem0tLjU0LjA0bDEuMjE0IDQuOTI3LTQuODc1LTEuNHptLTMuODk2IDQuMDJsNS4wMzcgMS40NDItMy43ODIgMy42Mzh6Ii8+PC9zdmc+"/><text transform="scale(.1)" x="630" y="175" textLength="620" fill="#fff" font-weight="bold">THREE.JS</text></g></svg> */}
    <img src="/test2343.png" alt="" />
    </div>

    <div>
        <ReactMarkdown>
          What up now

        </ReactMarkdown>
    </div>

    </Html>
  )
}

// Generate Plane Meshes
function setPlane(){

  return(
      <Float rotationIntensity={ 0.4 } >  
        <group>
          <mesh rotation={[0, Math.PI / 5, 0]} position = {[-2, 1.2, 0]}>
            <planeGeometry args={[3, 2, 1]} />

              <meshPhongMaterial
                emissive={0x3812BD}
                emissiveIntensity={1}
                color={0x000000}
                opacity={0.9}
                transparent
              />
          </mesh>

          <mesh rotation={[0, Math.PI / 5, 0]} position = {[-2, 0.1, 0]}>
              <boxGeometry 
              
              args={[0.75, 0.5, 0.75]} 
              
              
              />

              <meshPhongMaterial
                // emissive={0x123048}
                emissive={0xffffff}
                emissiveIntensity={1}
                color={0x000000}
                opacity={0.9}
                transparent
              />
          </mesh>

          {setText()}
          
        </group>
      </Float>
  )
}



// // function GlowMaterial(color, intensity) {
// //   return (
// //     <meshPhongMaterial
// //       emissive={color}
// //       emissiveIntensity={intensity}
// //       color={0xffffff}
// //       opacity={0.9}
// //       transparent
// //     />
// //   );
// // }

// // function MyScene() {
// //   const [hovered, setHovered] = useState(false);
// //   const meshRef = useRef();

// //   useFrame(() => {
// //     meshRef.current.rotation.x += 0.01;
// //     meshRef.current.rotation.y += 0.01;
// //   });

// //   return (
// //       <mesh
// //         ref={meshRef}
// //         onPointerOver={() => setHovered(true)}
// //         onPointerOut={() => setHovered(false)}
// //       >
// //         {/* Your geometry */}
// //         <planeGeometry args={[3, 4.5, 1]} />

// //         {hovered ? (
// //           <GlowMaterial color={new Color('purple')} intensity={1} />
// //         ) : (
// //           <MeshBasicMaterial color={0xffffff} />
// //         )}
// //       </mesh>

// //   );
// // }




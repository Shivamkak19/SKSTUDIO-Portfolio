import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF, Float, Html } from '@react-three/drei'

import ReactMarkdown from 'react-markdown';




import { useCursor, MeshReflectorMaterial} from '@react-three/drei'


export default function App() {
  return (
    <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 3, 100], fov: 15 }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>

          <Carla rotation={[0, Math.PI - 0.4, 0]} position={[-1.2, 0, 0.6]} scale={[0.26, 0.26, 0.26]} />
          <VideoText position={[0, 1.3, -2]} />
          <Ground />
          {/* {setPlane()} */}
        </group>

        <Intro />
      </Suspense>
    </Canvas>
  )
}

function Carla(props) {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} {...props} />
}

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

function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
    </Reflector>
  )
}

function Intro() {
  const [vec] = useState(() => new THREE.Vector3())
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}

function setText() {
  return (
    <Html
      transform
      wrapperClass="htmlScreen"
      distanceFactor={ 0 }
      position={ [ -2, 1.56, - 1.4 ] }
      rotation-x={ 0 }
      rotation-y={ 0}
  >

    <iframe 
    width="100%"
    height="100"   
    allowtransparency="true" 
    src="data:text/html;charset=utf-8,
    <head><base target='_blank' /></head>
    <body><script src='https://gist.github.com/Shivamkak19/fa982171f581aabae6013cf0faff4107.js'></script>
    </body>">


    </iframe>
    {/* <iframe src="https://gist.github.com/Shivamkak19/fa982171f581aabae6013cf0faff4107" /> */}

      {/* <div>
        <ReactMarkdown>

          ## Prerequisites

          To run this project, you must download the latest version of the Arduino IDE (2.1.1). 
          Download here: https://www.arduino.cc/en/software

          ### Installation

          1. Clone the repo
            ```sh
            git clone https://github.com/Shivamkak19/Spotify-BPMBuddy.git
            ```
        </ReactMarkdown>
      </div> */}
    </Html>
  )
}

function setPlane(){

  return(
      <Float rotationIntensity={ 0.4 } >  
        <group>
          <mesh rotation={[0, Math.PI / 5, 0]} position = {[-2, 1.5, 0]}>
            <planeGeometry args={[3, 2, 1]} />

              <meshPhongMaterial
                emissive={0x3812BD}
                emissiveIntensity={1}
                color={0x000000}
                opacity={0.9}
                transparent
              />
          </mesh>

          {/* {setText()} */}
        </group>
      </Float>
  )
}



// function GlowMaterial(color, intensity) {
//   return (
//     <meshPhongMaterial
//       emissive={color}
//       emissiveIntensity={intensity}
//       color={0xffffff}
//       opacity={0.9}
//       transparent
//     />
//   );
// }

// function MyScene() {
//   const [hovered, setHovered] = useState(false);
//   const meshRef = useRef();

//   useFrame(() => {
//     meshRef.current.rotation.x += 0.01;
//     meshRef.current.rotation.y += 0.01;
//   });

//   return (
//       <mesh
//         ref={meshRef}
//         onPointerOver={() => setHovered(true)}
//         onPointerOut={() => setHovered(false)}
//       >
//         {/* Your geometry */}
//         <planeGeometry args={[3, 4.5, 1]} />

//         {hovered ? (
//           <GlowMaterial color={new Color('purple')} intensity={1} />
//         ) : (
//           <MeshBasicMaterial color={0xffffff} />
//         )}
//       </mesh>

//   );
// }




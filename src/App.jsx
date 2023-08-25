import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Reflector, Text, useTexture, useGLTF, Html, Float} from '@react-three/drei'

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
      scale= { [ 0.1, 0.1, 0.1 ] }
  >
        <div className='planeText'>

            {/* Top of plane text section */}
            <div className="head">
                {/* Chrome */}
                <a href="https://developer.chrome.com/docs/extensions/"><img className="badgeLogo" src="https://img.shields.io/badge/Chrome-API-00427e?style=for-the-badge&logo=googlechrome&logoColor=61DAFB" /></a>

                {/* Spotify */}
                <a href="https://developer.spotify.com/documentation/web-api"><img className="badgeLogo" src="https://img.shields.io/badge/spotify-api-333333?style=for-the-badge&logo=spotify&logoColor=spotify&labelColor=000000" /></a>

                {/* HTML */}
                <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5"><img className="badgeLogo" src="https://img.shields.io/badge/HTML5-dc4a25?style=for-the-badge&logo=html5&logoColor=ffffff" /></a>

                {/* CSS */}
                <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img className="badgeLogo" src="https://img.shields.io/badge/CSS3-2862ea?style=for-the-badge&logo=css3&logoColor=ffffff" /></a>

                {/* JS */}
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img className="badgeLogo" src="https://img.shields.io/badge/JS-000000?style=for-the-badge&logo=javascript&logoColor=efd81c" /></a>

                {/* JSON */}
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON"><img className="badgeLogo" src="https://img.shields.io/badge/JSON-919191?style=for-the-badge&logo=json&logoColor=333333" /></a>

                {/* Tonejs */}
                <a href="https://tonejs.github.io/"><img className="badgeLogo" src="https://tinyurl.com/nhzmp7wt" /></a>
            </div>

            {/* Main body content */}
            <div className="body">

                <div className="github-section">
                  <div className="githubText">
                    <p>View on GitHub</p>
                  </div>
                  <div className="githublogo">
                    <a href="https://github.com/Shivamkak19/Spotify-BPMBuddy">
                      <img src="/github.png" className="socialLogo projectGithubLogo" alt="Github Logo"></img>
                    </a>
                  </div>
                </div>

                <img className="projectLogo" src="/projects/logo-main.png" alt="" />
                <div className="body-sections">

                    <div className="body-text1">
                    The Spotify BPM Buddy Chrome Extension is the perfect tool to bring
                     your jam sessions and music practice sessions to the next level. 
                     The extension allows users to adjust the tempo of their Spotify player 
                     to a desired input tempo (non-commercial use only).                     
                    </div>

                    <div className="body-text2">
                    Upon visiting https://open.spotify.com/, users will 
                    automatically be redirected to authorize usage with their 
                    Spotify account. Product After reaching the Spotify web player, 
                    they will be able to access the Spotify BPMBuddy as an icon in the 
                    footer containing the Spotify player. 
                    </div>
                </div>

            </div>

            {/* Plane Footer content */}
            <div className="tail">

            </div>
        </div>


    </Html>
  )
}

function setLabel(){
  return(
    <Html
    transform
    wrapperClass="htmlScreen"
    distanceFactor={ 0 }
    position={ [-2, 0.1, 0.5] }
    rotation-x={ 0 }
    rotation-y={ Math.PI / 5}
    scale= { [ 0.1, 0.1, 0.1 ] }
    >

        <div className="label-text">
            Hold to Drag.              
        </div>

    </Html>
  )
}

// Generate Plane Meshes
function setPlane(){


  return(
    <>
    <PresentationControls
      // Set attributes of presentation controls
      // global

      // About SKSTUDIO axis
      polar={[-0, 0.1]}

      // About axis vertical through cube
      azimuth={[-0.8, 0]}

      // Set attributes for spring library
      config={ {mass: 2, tension: 400} }
      snap={ {mass: 4, tension: 400} }
    >

      <Float rotationIntensity={ 0.4 } >  
        <group>
          <mesh rotation={[0, Math.PI / 5, 0]} position = {[-2, 1.2, 0]}>
            <planeGeometry args={[3, 2, 1]} />

              <meshPhongMaterial
                emissive={0x3812BD}
                emissiveIntensity={1}
                color={0x000000}
                opacity={0.3}
                transparent
              />

              {/* <MeshReflectorMaterial
                color="#3812BD"
                metalness={0.4}
                normalScale={[2, 2]}
                opacity={0.3}
              /> */}


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
          {setLabel()}
          
        </group>
      </Float>
    </PresentationControls>
    </>

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




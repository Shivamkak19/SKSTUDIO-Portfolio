import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Reflector, Text, useTexture, useGLTF, Html, Float} from '@react-three/drei'

import ReactMarkdown from 'react-markdown';
import { useCursor, MeshReflectorMaterial} from '@react-three/drei'

import test from "./test"
import projectContent from "./projectContent.json"
import planeMeshProps from "./planeMeshProps.json"

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

          {/* Load planeMesh for each project, pass JSON as prop */}
          {setPlane(planeMeshProps.ring1, projectContent.project1)}
          {setPlane(planeMeshProps.ring2, projectContent.project2)}
          {setPlane(planeMeshProps.ring3, projectContent.project3)}
          {setPlane(planeMeshProps.ring4, projectContent.project4)}
          {setPlane(planeMeshProps.ring5, projectContent.project5)}
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
  const { scene } = useGLTF('/polarbear.glb')
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

function setText(props, plane_props) {
  return (
    <Html
      transform
      wrapperClass="htmlScreen"
      distanceFactor={ 0 }
      position={ plane_props.plane_position }
      rotation={ plane_props.plane_rotation }
      scale= { [ 0.1, 0.1, 0.1 ] }
  >

      <div className='planeText'>

      {/* Top of plane text section */}
      <div className="head">

          {props.badges.map((badge) => (
            <a key={badge.link} target="_blank" href={badge.link}>
              <img className="badgeLogo" src={badge.image} />
            </a>
          ))}

      </div>

      {/* Main body content */}
      <div className="body">

          <div className="github-section">
            <div className="githubText">
              <p>View on GitHub</p>
            </div>
            <div className="githublogo">
              <a target="_blank" href= {props.github_link}>
                <img src="/github.png" className="socialLogo projectGithubLogo" alt="Github Logo"></img>
              </a>
            </div>
          </div>

          {/* <p className='githubText'>Project title</p> */}

          <img className="projectLogo" src= {props.logo_image} alt= {props.logo_alt} />
          <div className="body-sections">

              <div className="body-text1">
                    {props.text1}                 
              </div>

              <div className="body-text2">
                    {props.text2}
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


function setLabel(plane_props){
  return(
    <Html
    transform
    wrapperClass="htmlScreen"
    distanceFactor={ 0 }

    position={ plane_props.label_position }
    rotation={ plane_props.label_rotation }
    scale= { [ 0.1, 0.1, 0.1 ] }
    >

        <div className="label-text">
            Hold to Drag.              
        </div>

    </Html>
  )
}

// Generate Plane Meshes
function setPlane(plane_props, text_props){
  return(
    <>
      {/* Set attributes of presentation controls */}
      <PresentationControls
        // global

        // About SKSTUDIO axis
        polar={[-0, 0.1]}

        // About axis vertical through cube
        azimuth={plane_props.azimuth}

        // Set attributes for spring library
        config={ {mass: 2, tension: 400} }
        // snap={ {mass: 4, tension: 400} }
      >

        <Float rotationIntensity={ plane_props.rotationIntensity } >  
          <group scale={plane_props.scale_master}>
            <mesh rotation={plane_props.plane_rotation} position = {plane_props.plane_position}>
              <planeGeometry args={[3, 2, 1]} />

                {/* <meshPhongMaterial
                  emissive={0x3812BD}
                  emissiveIntensity={1}
                  color={0x000000}
                  opacity={0.3}
                  transparent
                /> */}

                <MeshReflectorMaterial
                  color={plane_props.plane_color}
                  metalness={0.4}
                  normalScale={[2, 2]}
                  opacity={0.3}
                />
            </mesh>
            <mesh rotation={plane_props.box_rotation} position = {plane_props.box_position}>
              <boxGeometry args={[0.75, 0.5, 0.75]} />

              <meshPhongMaterial
                // emissive={0x123048}
                emissive= {plane_props.box_color}
                emissiveIntensity={1}
                color={0x000000}
                opacity={0.9}
                transparent
              />
            </mesh>


            {setText(text_props, plane_props)}
            {setLabel(plane_props)}
          </group>
        </Float>
      </PresentationControls>
    </>
  )
}






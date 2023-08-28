
// React Three Fiber Imports 
import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PresentationControls, Reflector, Text, useTexture, useGLTF, Html, Float, Scroll} from '@react-three/drei'

import { useCursor, MeshReflectorMaterial} from '@react-three/drei'

// JSON imports
import projectContent from "./projectContent.json"
import planeMeshProps from "./planeMeshProps.json"
import animationState from "./animationStateTheatreJS_linear.json"


// Theatre JS imports
import { getProject, val } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { ScrollControls, useScroll } from "@react-three/drei";
import { editable as e, SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'


// Initialize Theatre JS studio only in dev mode
if (import.meta.env.DEV) {
  studio.initialize()
  studio.extend(extension)
}

localStorage.clear();

// Loads All other components into main app for export
export default function App() {

  
  // const mySheet =  getProject('Demo Project').sheet('Demo Sheet')
  const mySheet = getProject("SKSTUDIO Animation State", {state: animationState}).sheet("SKSTUDIO_SCENE");


  return (
    <>
        <Header />
        <Canvas concurrent gl={{ alpha: false, preserveDrawingBuffer: true }} pixelRatio={[1, 1.5]}>
            {/* Wrap in scroll controls for animation w/ mouse scroll */}
            <ScrollControls pages={50}>

                {/* Must wrap the scene in sheetprovider to use theatre.js */}
                <SheetProvider sheet={ mySheet } >
                    <Scene />
                </SheetProvider>
            </ScrollControls>
        </Canvas>
    </>
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


function Scene(){
  
  //Mobile Responsiveness
  const { viewport } = useThree()

  // Model transformation parameters
  const rotation = [0, Math.PI - 0.4, 0];
  const position = [-1.2, 0, 0.6];
  const scale = [0.26, 0.26, 0.26];

  const sheet = useCurrentSheet();
  const scroll = useScroll();

  // scroll.el. = 1

  console.log(scroll.el.scrollTopMax)
  console.log(scroll.offset)


  scroll.el.onscroll = () => {
    console.log("we out")
    console.log(scroll.el.scrollTop)

  }

  const scrollGoal = 30000
console.log("gate 2")
const boolean = (scroll.el.scrollTop - scrollGoal) > 200
const num = Math.abs(scroll.el.scrollTop - scrollGoal)

console.log(boolean)
console.log (num)

  while (Math.abs(scroll.el.scrollTop - scrollGoal) > 200) {
    console.log("inside out")
    setTimeout(() =>{
      if (scroll.el.scrollTop < scrollGoal) {
        scroll.el.scrollTop += 100;
      } else {
        scroll.el.scrollTop -= 100;
      }
      console.log("inside")
      console.log(scroll.el.scrollTop)

    // Repeat after 0.1 seconds
    }, 10); 
  }

  console.log("gate 2 end")


  // our callback will run on every animation frame
  useFrame(() => {
    // the length of our sequence
    const sequenceLength = val(sheet.sequence.pointer.length);

    // update the "position" of the playhead in the sequence, as a fraction of its whole length
    sheet.sequence.position = scroll.offset * sequenceLength;
  });



  return(
    <>
    
      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 3, 100]}
        fov={15}
        // near={0.1}
        // far={70}
      />

      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <group scale={(viewport.width / 15)} position={[0, -1, 0]}>

          
        
          {modelLoad({rotation, position, scale})}

          <e.group theatreKey="text">
              <VideoText position={[0, 1.3, -2]} />
          </e.group>

          {/* Load planeMesh for each project, pass JSON as prop */}
          {setPlane(planeMeshProps.plane1, projectContent.project1)}
          {setPlane(planeMeshProps.plane2, projectContent.project1)}
          {setPlane(planeMeshProps.plane3, projectContent.project1)}
          {setPlane(planeMeshProps.plane4, projectContent.project1)}
          {setPlane(planeMeshProps.plane5, projectContent.project1)}
          {setPlane(planeMeshProps.plane6, projectContent.project1)}
          {setPlane(planeMeshProps.plane7, projectContent.project1)}
          {setPlane(planeMeshProps.plane8, projectContent.project1)}

          {/* Load duplicates for "View All Projects Section" */}
          {setPlane(planeMeshProps.ring1, projectContent.project1)}
          {setPlane(planeMeshProps.ring2, projectContent.project2)}
          {setPlane(planeMeshProps.ring3, projectContent.project3)}
          {setPlane(planeMeshProps.ring4, projectContent.project4)}
          {setPlane(planeMeshProps.ring5, projectContent.project5)}
          <Ground />
        </group>

        <e.ambientLight theatreKey="ambientLight" intensity={0.5} />
        <e.spotLight theatreKey="spotLight" position={[0, 10, 0]} intensity={0.3} />
        <e.directionalLight theatreKey="dirLight" position={[-50, 0, -40]} intensity={0.7} />

        <Intro />
      </Suspense>
    
    </>
  )

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

  // console.log(plane_props.theatreKey)
  
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

        <Float 
        // XYZ float rotation
        rotationIntensity={ plane_props.rotationIntensity } 
        // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatIntensity={ plane_props.floatingIntensity} 
        // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        floatingRange={ plane_props.floatingRange} 
        >  

          <e.group theatreKey={plane_props.theatreKey} scale={plane_props.scale_master}>
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
          </e.group>
        </Float>
      </PresentationControls>
    </>
  )
}


function Header() {

  // Add event listeners for links to animation anchors
  const handleLinkClick1 = (event) => {
    event.preventDefault();
    console.log("clicked 1");
    scroll.offset = 0
    console.log(scroll.offset)
  };

  const handleLinkClick2 = (event) => {
    event.preventDefault();
    console.log("clicked 2");
    scroll.offset = 0.25
    console.log(scroll.offset)

  };

  const handleLinkClick3 = (event) => {
    event.preventDefault();
    console.log("clicked 3");
    scroll.offset = 0.5
    console.log(scroll.offset)

  };

  const handleLinkClick4 = (event) => {
    event.preventDefault();
    console.log("clicked 4");
    scroll.offset = 0.75
    console.log(scroll.offset)

  };

  const handleLinkClick5 = (event) => {
    event.preventDefault();
    console.log("clicked 5");
    scroll.offset = 1
    console.log(scroll.offset)

  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/skstudio-logo.png" alt="Logo" />
      </div>
      <nav className="nav">
        <ul>
          <li id="link1" className="link">
            <a href="#" onClick={handleLinkClick1}>
              Home
            </a>
          </li>
          <li id="link2" className="link">
            <a href="#" onClick={handleLinkClick2}>
              About
            </a>
          </li>
          <li id="link3" className="link">
            <a href="#" onClick={handleLinkClick3}>
              Inquiries
            </a>
          </li>
          <li id="link4" className="link">
            <a href="#" onClick={handleLinkClick4}>
              Services
            </a>
          </li>
          <li id="link5" className="link">
            <a href="#" onClick={handleLinkClick5}>
              All Projects
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}




import { Perf } from 'r3f-perf'
import { Canvas } from '@react-three/fiber'
import Main from './Main.jsx'
import { Environment } from '@react-three/drei'
import { Leva } from 'leva'

// Parameters
const cameraFar = 110
const planeDistance = - (cameraFar - 20)
const canDistance = - (cameraFar - 30)
const lightThemeColor = '#fffff0' 
const darkThemeColor = '#00000f' 

export default function Experience() 
{   
    return <>
        <Leva 
            hidden={ true }
        />
        <Canvas 
            flat
            camera={ { fov: 20, near: 0.01, far: cameraFar } }
            gl={ { alpha: true } }
        >   
            {/* Performance monitor */}
            {/* <Perf position="bottom-right" /> */}


            {/* Lights */}
            <ambientLight intensity={ 0.1 } />
            <directionalLight position={ [ -3, 3, 3 ] } intensity={0.5} />

            {/* Environment Map */}
            <Environment 
                preset="city" 
                resolution={ 128 }
            />

            {/* Main scene */}
            <Main 
                planeDistance={ planeDistance } 
                canDistance={ canDistance } 
                lightThemeColor={ lightThemeColor } 
                darkThemeColor={ darkThemeColor } 
            />

        </Canvas>
    </>  
}

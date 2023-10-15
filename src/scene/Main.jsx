import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { easing } from 'maath'
import Background from './Background.jsx'
import Cans from './Cans.jsx'
import Portal from './Portal.jsx'
import Music from './Audio.jsx'
import OverlayText from './OverlayText.jsx'

export default function Main({ planeDistance, canDistance, lightThemeColor, darkThemeColor })
{   
    const canGroup = useRef()

    // Debug controls
    const { range, offset, easingIntensity } = useControls('Cans', { 
        range: { value: 100, min: 0, max: 300, step: 10 }, 
        offset: { value: 10, min: 0, max: 100, step: 1 },
        easingIntensity: { value: 0.5, min: 0, max: 2, step: 0.01 },
    })
    const { textOuterColor, textInnerColor, textOpacity, backgroundOuterOpacity, backgroundInnerOpacity } = useControls('Background Overlay', {
        textOuterColor: { value: '#4600ff' },
        textInnerColor: { value: '#0077ff' },
        textOpacity: { value: 0.45, min: 0, max: 1, step: 0.01 },
        backgroundOuterOpacity: { value: 0, min: 0, max: 1, step: 0.01 },
        backgroundInnerOpacity: { value: 0.1, min: 0, max: 1, step: 0.01 },
    })

    // Generate cans' initial data
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, 0 ])
    const data = useMemo(() => GenerateInitials( canDistance, viewport, camera, range, offset ), [ range, offset ])

    // Load geometry and materials
    const canModelLight = useGLTF('./models/water_light.glb')
    const canModelDark = useGLTF('./models/water_dark.glb')
    const canGeometry = canModelLight.nodes.can_threejs_low.geometry
    const canMaterialLight = canModelLight.materials.can
    const canMaterialDark = canModelDark.materials.can

    useFrame((state, delta) => {
        easing.damp3(
            canGroup.current.position, // initial
            [- (state.mouse.x * width) / 2 * easingIntensity, - (state.mouse.y * height) / 2 * easingIntensity, 0], // target
            0.2, // damping
            delta /// time delta
        )
    })

    return <>
        <group>
            <group ref={ canGroup } scale={ 1 }>
                <Cans data={ data } range={ range } geometry={ canGeometry } material={ canMaterialLight } invert={ true } />
                <Cans data={ data } range={ range } geometry={ canGeometry } material={ canMaterialDark } invert={ false } />
                <OverlayText distance={ planeDistance + 1 } invert={ false } color={ textOuterColor } opacity={ textOpacity } />
                <OverlayText distance={ planeDistance + 1 } invert={ true } color={ textInnerColor } opacity={ textOpacity } />
            </group>
            
            <group>
                <Background distance={ planeDistance } color={ lightThemeColor }  invert={ true } opacity={ backgroundOuterOpacity }/>
                <Background distance={ planeDistance } color={ darkThemeColor } invert={ false } opacity={ backgroundInnerOpacity } />
            </group>

            <Portal color={ darkThemeColor }/>

            <Music />
        </group>
    </>
}

function GenerateInitials(distance, viewport, camera, range, offset)
{
    /** Can Positions */
    // X - spread between -height and +height of the current viewport
    // Y - spread between -height and +height of the current viewport
    // Z - spread from camera's near to camera's far with offset
    const randomPosition = (i, d, r, o) => {

        const canDistance = (i / r) * d - o
        const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, canDistance ])

        return [ 
            THREE.MathUtils.randFloatSpread(2 * width), 
            THREE.MathUtils.randFloatSpread(2 * height), 
            canDistance 
        ]
    }

    /** Can Positions */
    // Random rotation
    const randomRotation = () => [ 
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI 
    ]

    /** Data array */
    const data = Array.from({ length: range }, 
        (v, i, d=distance, r=range, o=offset) => ({ 
            position: randomPosition(i, d, r, o), 
            rotation: randomRotation() 
        }))

    return data
}

// Preloading models
useGLTF.preload('./models/water_light.glb')
useGLTF.preload('./models/water_dark.glb')
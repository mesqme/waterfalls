import { Mask } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { easing } from 'maath'

export default function Portal({ color, scale = 1 })
{   
    const portal = useRef()
    const mask = useRef()

    // Viewport parameters
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, 0 ])

    // Defining circle size and min/max circle scale
    const circleSize = Math.min( width, height ) / 3


    useFrame(( state, delta ) =>
    {
        easing.damp3(
            portal.current.position, // initial
            [(state.mouse.x * width) / 2, (state.mouse.y * height) / 2, 0], // target
            0.2, // damping
            delta /// time delta
        )
    })


    return <>
        <group 
            ref={ portal } 
            scale={ 1 }
        >
            <Mask 
                ref={ mask } 
                id={ 1 } 
                position={ [0, 0, 0] } 
                scale={ scale }
                depthWrite = { false }
                colorWrite = { false }
            >
                <sphereGeometry args={ [ circleSize, 64, 64 ] } />
                <meshBasicMaterial color={ color } />
            </Mask>
        </group>
        
    </>
}

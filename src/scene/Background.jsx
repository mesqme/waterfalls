import { useMask } from '@react-three/drei'
import { useThree } from '@react-three/fiber'


export default function Background({ distance, color, invert, opacity })
{   
    const stencil = useMask(1, invert)

    // Viewport parameters
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, distance ])

    return <>
        <mesh
            position-z={ distance }
            scale={ [ width, height, 1 ] }
        >
            <planeGeometry />
            <meshBasicMaterial 
                color={ color } 
                transparent={ true } 
                opacity={ opacity } 
                { ...stencil } 
            />
        </mesh>
    </>
}
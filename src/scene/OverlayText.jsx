import { Text, useMask } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export default function OverlayText({ distance, invert, color, opacity })
{   
    const stencil = useMask(1, invert)

    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, distance ])

    return <>
        <Text 
            font={ './bebas-neue-v14-latin-regular.woff' }
            scale={ Math.min(width, height) * 0.4 }
            maxWidth={ 1 }
            lineHeight={ 0.75 }
            textAlign="right"
            position-x={ 0 }
            position-y={ 0 }
            position-z={ distance }
        >
            Threejs Journey Challenge
            <meshBasicMaterial 
                toneMapped={ false } 
                color={ color } 
                transparent={ true } 
                opacity={ opacity } 
                { ...stencil } 
            />
        </Text>
    </>
}
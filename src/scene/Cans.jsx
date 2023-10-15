import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Instance, Instances, useMask } from '@react-three/drei'

export default function Cans({ data, range, geometry, material, invert })
{
    const stencil = useMask(1, invert)

    return(
        <Instances range={ range } material={ material } geometry={ geometry }>
            <meshStandardMaterial args={ [ material ] } { ...stencil } attach="material" toneMapped={ false }/>
            <group position={ [ 0, 0, 0 ] } >
                { data.map(( props, i ) => (
                    <Can key={i} { ...props } />
                )) }
            </group>
        </Instances>
    )
}

function Can({ ...props })
{
    const ref = useRef()

    const { viewport, camera } = useThree()

    useFrame((state, delta) => 
    {
        const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, ref.current.position.z ])

        ref.current.rotation.x += delta * 0.1
        ref.current.rotation.y += delta * 0.2
        ref.current.rotation.z += delta * 0.1
        ref.current.position.y -= delta * 0.3
        ref.current.position.x * width

        // // Returning can to top
        if (ref.current.position.y <  -height) {
            ref.current.position.y = height
        }
    })

    return (
        <group ref={ ref } { ...props }>
            <Instance scale={ 1 }/>
        </group>
    )
}
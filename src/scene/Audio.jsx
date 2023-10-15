import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { suspend } from 'suspend-react'
import { easing } from 'maath'


export default function Music()
{   
    const sphere = useRef()

    const [ ready, setReady ] = useState(false)
    const [ scaler, setScaler ] = useState(false)

    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [ 0, 0, 0 ])

    useFrame((state, delta) =>
    {
        if(scaler)
        {
            easing.damp3(
                sphere.current.scale, // initial
                Math.min(width, height) * 0.7, // target
                0.1, // damping
                delta /// time delta
            )
        }
        else
        {
            easing.damp3(
                sphere.current.scale, // initial
                Math.min(width, height) * 0.5, // target
                0.1, // damping
                delta /// time delta
            )
        }
    })

    return<>
        <group 
            position={[ width * 0.4, -height * 0.4, 0 ]} 
            scale={ 0.8 } 
        >   
            <group position-x={ -0.25 }>
                <Suspense>
                    {/* <Track position={ [ width * 0.4, - height * 0.45, 0] } url='./ambient.mp3' /> */}
                    { ready && <Track url='./lofi_waterfalls.mp3' /> }
                    {/* <Zoom url='./ambient.mp3' /> */}
                </Suspense>
            </group>

            <group 
                ref={ sphere }
                onClick={ () => { setReady(!ready) } }
                onPointerEnter={ () => { setScaler(true) } }
                onPointerLeave={ () => { setScaler(false) } }
            >
                <mesh>
                    <sphereGeometry args={[ 0.1, 32, 32 ]} />
                    <meshBasicMaterial color="#0099ff" depthWrite={ false } />
                </mesh>

                <Text 
                    font={ './bebas-neue-v14-latin-regular.woff' }
                    scale={ 0.08 }
                >
                    Sound
                </Text>
            </group>
        </group>
    </>
}

export function Track({ url, y = 2500, space = 2.5, radius = 0.03, height = 0.05, obj = new THREE.Object3D(), ...props }) 
{
    const ref = useRef()
    const { gain, context, update, data } = suspend(() => createAudio(url), [url])

    useEffect(() => {
        gain.connect(context.destination)
        return () => gain.disconnect()
    }, [gain, context])

    const amount = 4
  
    useFrame((state) => {
        let avg = update()
        for (let i = 0; i < amount; i++) {
            obj.position.set(i * radius * space - (amount * radius * space) / 2, data[i + 3] * 0.5 / y, 0)
            obj.updateMatrix()
            ref.current.setMatrixAt(i, obj.matrix)
        }
        ref.current.material.color.setHSL(0.62, 1.0, 0.1 + avg / 100)
        ref.current.instanceMatrix.needsUpdate = true
    })

    return <>
        <instancedMesh ref={ref} args={[null, null, amount]} {...props}>
            <sphereGeometry args={[ radius, 16, 16 ]} />
            <meshBasicMaterial toneMapped={false} depthWrite={ false } />
        </instancedMesh>
    </>
}

  
async function createAudio(url) 
{
    const res = await fetch(url)
    const buffer = await res.arrayBuffer()
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const source = context.createBufferSource()
    source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res))
    source.loop = true
    source.start(0)
    const gain = context.createGain()
    const analyser = context.createAnalyser()
    analyser.fftSize = 64
    source.connect(analyser)
    analyser.connect(gain)
    const data = new Uint8Array(analyser.frequencyBinCount)

    return {
        context,
        source,
        gain,
        data,
        update: () => {
            analyser.getByteFrequencyData(data)
            return (data.avg = data.reduce((prev, cur) => prev + cur / data.length, 0))
        },
    }
}
  
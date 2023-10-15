import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Loader } from '@react-three/drei'
import Experience from './scene/Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <React.StrictMode>
        <Experience />
        <Loader />
        <a className="bottom-left-1" children="Created by .mesq" />
        <a className="bottom-left-2" children="Music by LoFi Recordings" />
        <span className="header">WATER FALLS</span>
    </React.StrictMode>
)
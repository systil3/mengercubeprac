import * as THREE from 'three'
import { addPass, useCamera, useGui, useRenderSize, useScene, useTick } from './render/init.js'
// import postprocessing passes
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

function mengerGeometry(l, div, depth, limit, pos) {

    var sponge = new THREE.BufferGeometry()
    let nl = l / div;

    if(depth == limit) {
        return new THREE.BoxGeometry(l, l, l, div, div, div)
    }

    for(let i = 0; i < div; i++) {
        for(let j = 0; j < div; j++) {
            for(let k = 0; k < div; k++ ) {
                if(div % 2 == 0 && 
                    (i != parseInt(div/2) && i != parseInt(div/2)) ||
                    (j != parseInt(div/2) && j != parseInt(div/2)) ||
                    (k != parseInt(div/2) && k != parseInt(div/2)) ) {
                        this.sponge.merge(mengerGeometry(l/3, div, depth+1, limit, 
                        {
                            x: pos.x + nl*i,
                            y: pos.y + nl*j,
                            z: pos.z + nl*k
                        }))
                }
                if(div % 2 == 1 && 
                    (i != parseInt((div-1)/2)) ||
                    (j != parseInt((div-1)/2)) ||
                    (k != parseInt((div-1)/2))) {
                        this.sponge.merge(mengerGeometry(l/3, div, depth+1, limit, 
                        {
                            x: pos.x + nl*i,
                            y: pos.y + nl*j,
                            z: pos.z + nl*k
                        }))
                }
            }
        }
    } return this.sponge
}

let geometry = new mengerGeometry(9, 3, 0, 3, {x: 0, y: 0, z: 0})

let material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      iResolution: [100, 100, 100],
      uTime: {value: 0}
    }, 
    side: THREE.DoubleSide
  })
  
new THREE.Mesh(geometry, material)
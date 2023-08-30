import * as THREE from 'three'
import { addPass, useCamera, useGui, useRenderSize, useScene, useTick } from './render/init.js'
// import postprocessing passes
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const startApp = () => {
  const scene = useScene()
  const camera = useCamera()
  const gui = useGui()
  const { width, height } = useRenderSize()
  let uTime = 0

  // settings
  const MOTION_BLUR_AMOUNT = 0.725

  // lighting
  const dirLight = new THREE.DirectionalLight('#ffffff', 0.75)
  dirLight.position.set(5, 5, 5)

  const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
  scene.add(dirLight, ambientLight)
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      iResolution: [100, 100, 100],
      uTime: {value: 0}
    }, 
    side: THREE.DoubleSide
  })
  const material2 = new THREE.MeshNormalMaterial()

  var sponge = new THREE.Object3D()

  function mengerGeometry(l, div, depth, limit, pos) {
    const nl = l / div;
    if(depth === limit) {
      console.log(pos, l)
      /*const geometry = new THREE.BufferGeometry() 
      const [x, y, z] = Object.values(pos)
      const vertices = new Float32Array([
          x, y, z,
          x+l, y, z,
          x, y+l, z,
          x+l, y+l, z,
          x, y+l, z+l,
          x+l, y, z+l,
          x+l, y+l, z+l
      ])
      geometry.setAttribute('position', 
        new THREE.BufferAttribute(vertices, 8))*/
      //buffergeometry merging not working properly

      const geometry = new THREE.BoxGeometry(l, l, l, div, div, div)
      const [x, y, z] = Object.values(pos)
      var cube = new THREE.Mesh(geometry, material2)
      cube.position.set(
        x, y, z
      )
      sponge.add(cube)
      return 
    }

    function print() {
      console.log(this.sponge)
    }

    for(let i = 0; i < div; i++) {
        for(let j = 0; j < div; j++) {
            for(let k = 0; k < div; k++) {
                if(div % 2 == 0) {
                  if((i === parseInt(div/2) || i === parseInt(div/2-1)) +
                  (j === parseInt(div/2) || j === parseInt(div/2-1)) +
                  (k === parseInt(div/2) || k === parseInt(div/2-1)) < 2) {
                    mengerGeometry(nl, div, depth+1, limit, 
                        {
                              x: pos.x + nl*i,
                              y: pos.y + nl*j,
                              z: pos.z + nl*k
                        })
                    }
                }
                else if(div % 2 == 1) {
                  if ((i === parseInt((div-1)/2)) +
                  (j === parseInt((div-1)/2)) +
                  (k === parseInt((div-1)/2)) < 2) {
                    mengerGeometry(nl, div, depth+1, limit, 
                      {
                            x: pos.x + nl*i,
                            y: pos.y + nl*j,
                            z: pos.z + nl*k
                      })
                  }
                }
            }
        }
    } //print();
  }

  mengerGeometry(1, 3, 0, 2, {x: 0, y: 0, z: 0})
  sponge.position.set(-1, -1, -1)
  scene.add(sponge)

  // GUI
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'z', 0, 10)
  cameraFolder.open()

  // postprocessing
  const renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  }

  // save pass
  const savePass = new SavePass(new THREE.WebGLRenderTarget(width, height, renderTargetParameters))

  // blend pass
  const blendPass = new ShaderPass(BlendShader, 'tDiffuse1')
  blendPass.uniforms['tDiffuse2'].value = savePass.renderTarget.texture
  blendPass.uniforms['mixRatio'].value = MOTION_BLUR_AMOUNT

  // output pass
  const outputPass = new ShaderPass(CopyShader)
  outputPass.renderToScreen = true

  // adding passes to composer
  addPass(blendPass)
  addPass(savePass)
  addPass(outputPass)

  useTick(({ timestamp, timeDiff }) => {
    material.uniforms.uTime.value = timestamp / 1000
  })
}

export default startApp

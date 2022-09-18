import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three-orbitcontrols/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const width = window.innerWidth,
    height = window.innerHeight;

// Create a renderer and add it to the DOM.
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(width, height);
// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x080808 );


// Create a camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
camera.position.z = 50;
camera.position.y = 1;

scene.add(camera);

// Create a light, set its position, and add it to the scene.
const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
scene.add(light);

const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
scene.add(hemiLight);

const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.castShadow = true;



//Set up shadow properties for the light
spotLight.shadow.mapSize.width = 512; // default
spotLight.shadow.mapSize.height = 512; // default
spotLight.shadow.camera.near = 0.5; // default
spotLight.shadow.camera.far = 500; // default
spotLight.shadow.focus = 1; // default

scene.add( spotLight );

// Add OrbitControls so that we can pan around with the mouse.
//const controls = new THREE.OrbitControls(camera, canvas);
// const gui = new dat.GUI({
//    width : 300,
// });

const parameters = { color: 0xFF0000 }
//gui.addColor(parameters, 'color').onChange(() => { directionalLight.color.set(parameters.color) })

//const helper = new THREE.CameraHelper( spotLight.shadow.camera );
//scene.add( helper );

//gui.addColor(parameters, 'color').onChange(() => { light.color.set(parameters.color) })


// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
  // resource URL
  'saint-just.glb',
  // called when the resource is loaded
  function ( gltf ) {
    gltf.scene.traverse( function( node ) {
        if ( node.isMesh ) { node.castShadow = true; }
        if ( node.isMesh || node.isLight ) node.receiveShadow = true;
    } );
    scene.add( gltf.scene );

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    gltf.scene.scale.set(10,10,10)

    gltf.scene.rotation.y = 3;
    gltf.scene.rotation.x = -0.1;

    // const objectFolder = gui.addFolder('Object')
    // objectFolder.add(gltf.scene.rotation, 'y', 0, 10)
    // objectFolder.add(gltf.scene.rotation, 'x', 0, 10)
    // objectFolder.open()

    // const cameraFolder = gui.addFolder('Cam')
    // cameraFolder.add(camera.position, 'z', -20, 50)
    // cameraFolder.open()

    let oldValue = 0;
    window.addEventListener('scroll', function(e){
        let scroll = window.pageYOffset;

        // Get the new Value
        let newValue = window.pageYOffset;

        //Subtract the two and conclude
        if(oldValue - newValue < 0){
            camera.position.z -= 0.59;
            if(scroll > 2300) {
            //gltf.scene.rotation.y = scroll / 100
            gltf.scene.rotation.x += 0.027;
            camera.position.z += 3;
          }
        } else if(oldValue - newValue > 0){
            camera.position.z += 0.79;
            if(scroll > 2300) {
              gltf.scene.rotation.x -= 0.01;
              camera.position.z -= 3;
          }
        }

        // Update the old value
        oldValue = newValue;
    });

    // window.addEventListener("scroll", (event) => {
    //   let scroll = window.pageYOffset;
    //   //1er point
    //   // cameraZ = 7
    //   // On veut aller de 1 à 7
    //   // landRotateY = 3
    //   //console.log(camera.position.z)
    //   //console.log(scroll / 100)
    //   //console.log(camera.position.z)
    //   // Objectif aller de 50 à 5
    //   //camera.position.z = scroll / 100;
    //   //camera.rotation.x = scroll / 100;
    //   camera.position.z -= 0.35;
    //   if(scroll > 400 && scroll < 1500) {
    //     //2er point
    //     // cameraZ = 1
    //   }

    //   // 3e point
    //   // cameraZ = 9
    //   // landRotateY = 3.02
    //   // landRotateX = 0.52
    //   console.log(gltf.scene.rotation.x)
    //   console.log(scroll)
    //   if(scroll > 2300) {
    //     //gltf.scene.rotation.y = scroll / 100
    //     gltf.scene.rotation.x += 0.05;
    //   }
    // // });

  },
  // called while loading is progressing
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  },
  // called when loading has errors
  function ( error ) {

    console.log( 'An error happened' );

  }
);


resize();
animate();
window.addEventListener('resize',resize);

function resize(){
  let w = window.innerWidth;
  let h = window.innerHeight;

  renderer.setSize(w,h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Renders the scene
function animate() {

  renderer.render( scene, camera );
  //controls.update();
  console.log(spotLight.position.z)

  requestAnimationFrame( animate );
}


import * as THREE from './libs/three.module.js'
import { OrbitControls } from './libs/controls/OrbitControls.js';
import { GLTFLoader } from './libs/loaders/GLTFLoader.js';

let renderer = null, scene = null, camera = null, orbitControls = null;

let spotLight = null, ambientLight = null;

let idleAction = null;
let mixer = null;
let currentTime = Date.now();
let objects = [];


const mapUrl = "../../images/checker_large.gif";

const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

async function loadGLTF(gltfModelUrl)
{
    try
    {
        const gltfLoader = new GLTFLoader();

        const result = await gltfLoader.loadAsync(gltfModelUrl, onProgress, onError);
        const object = result.scene || result.scenes[0];
        object.scale.set(5,5,5);

        object.mixer = new THREE.AnimationMixer( scene );
        object.action = object.mixer.clipAction( result.animations[1], object).setDuration( 1.0 );
        object.action.play();
        objects.push(object); 

        

        object.traverse(model =>{
            if(model.isMesh)
                model.castShadow = true; 
           
        });
        scene.add(object);

             
    }
    catch(err)
    {
        console.error(err);
    }
}

async function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    for(const object of objects)
    {

        if(object.mixer)
            object.mixer.update(deltat*0.001);
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    animate();

    orbitControls.update();
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-30, 15, 40);
    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    spotLight = new THREE.SpotLight (0xffffff, 1.5);
    spotLight.position.set(0, 40, 50);
    spotLight.target.position.set(-2, 0, -2);
    scene.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;


    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    scene.add(ambientLight);

    loadGLTF();

    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    const geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.02;

    
    scene.add( floor );

    floor.castShadow = false;
    floor.receiveShadow = true;
    

}


function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    loadGLTF('./models/Soldier.glb');

    update();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);

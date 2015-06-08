'use strict';
var MP = 'assets/mesh/';
var placer;
var scene, camera, renderer;
var geometry, material, mesh;
var ROT_SPEED = 0.01;

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}


function createRenderer() {
    renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true} );
    renderer.setClearColor(0xcccccc, 0.825);
    renderer.setSize( placer.clientHeight, placer.clientWidth);
    renderer.shadowMapEnabled = true;
}

function createCamera(){
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,1000.0);

    camera.position.x = 0;
    camera.position.y = 9;
    camera.position.z = 16;

    camera.lookAt(scene.position);
}

function createLight() {
    var light = new THREE.AmbientLight( 0x909090 ); // soft white light
    scene.add( light );

    var spotLight = new THREE.SpotLight(0xffffff,1.25);
    spotLight.position.set(5, 15, 5);
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 1;
    spotLight.shadowCameraFar = 30;
    spotLight.shadowCameraFov = 45;

    spotLight.castShadow = true;
    scene.add(spotLight);
}

function render() {
    if(scene.getObjectByName("antonio"))
        rotateAroundWorldAxis(scene.getObjectByName("antonio"), new THREE.Vector3(0,1,0), ROT_SPEED );

    renderer.render(scene, camera);

    setTimeout( function() {

        requestAnimationFrame(render);

    }, 1000 / 60 );
}

function init(){
    //create scene
    scene = new THREE.Scene();
    placer = document.getElementById('canvas-placer');

    //create the renderer
    createRenderer();

    //create the camera
    createCamera();

    //create a box
    createBox();
    var box = createBox();
    box.name = 'box';
    box.position.y += 2.5;
    box.material.color.setHex(0xffffff);
    //scene.add( box );

    //create a Circle
    var base = createCircle();
    base.name = 'base';
    base.position.y -= 7.0;
    base.material.color.setHex(0xf7f7f7);
    scene.add( base );

    //crate character

    fromURL(MP + 'Creeper/Creeper3.obj',MP + 'Creeper/creeper_tex.png');


    //create a light
    createLight();

    placer.appendChild(renderer.domElement);
    render();
}

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
$('#canvas-placer').on('mousedown', function(e) {
    isDragging = true;
})
    .on('mousemove', function(e) {
        //console.log(e);
        var deltaMove = {
            x: e.offsetX-previousMousePosition.x,
            y: e.offsetY-previousMousePosition.y
        };

        if(isDragging) {
            rotateAroundWorldAxis(scene.getObjectByName("antonio"), new THREE.Vector3(0,1,0),deltaMove.x * 0.05 );
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});


function show3DModel(placerID,options){
    options = options || {};
    scene = new THREE.Scene();
    placer = document.getElementById(placerID);

    //create the renderer
    createRenderer(options);

    //create the camera
    createCamera(options);

    //create a Circle
    var base = createCircle();
    base.name = 'base';
    base.position.y -= 7.0;
    base.material.color.setHex(0xf7f7f7);
    scene.add( base );

    //crate character

    fromURL(MP + 'Creeper/Creeper3.obj',MP + 'Creeper/Creeper Skin.png');


    //create a light
    createLight();

    placer.appendChild(renderer.domElement);
    render();
}
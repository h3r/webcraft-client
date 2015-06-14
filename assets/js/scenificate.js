/**
 * Created by h3R on 20/05/2015.
 */
'use strict';
var MP = 'assets/mesh/';
var placer;
var scene, camera, renderer;
var geometry, material, mesh;
var controls;
var ROT_SPEED = 0.01;
var update = function(dt){ alert('no update function defined')};

var INV_MAX_FPS = 1 / 60;                                              // 0.01666666666
var frameDelta = 0;
var clock = new THREE.Clock();
var dt = 0;


function createRenderer (options){
    options = options || {};

    renderer = new THREE.WebGLRenderer( options );
    renderer.setClearColor(options.color || 0x000000, options.opacity || 1.0);
    renderer.setSize( placer.clientHeight, placer.clientWidth);
    renderer.shadowMapEnabled = options.shadowMapEnable || false;
}
function createCamera(options){
    options = options || {};

    camera = new THREE.PerspectiveCamera(
        options.fov || 45,
        options.aspect || window.innerWidth / window.innerHeight,
        options.near || 0.1,
        options.far || 10000.0);

    camera.position.x = options.eye[0] || 0;
    camera.position.y = options.eye[1] || 10;
    camera.position.z = options.eye[2] || 10;
    camera.name = 'camera';

    camera.lookAt(scene.position);
}
function createLight() {
    var light = new THREE.AmbientLight( 0x909090 ); // soft white light
    scene.add( light );

    var spotLight = new THREE.SpotLight(0xffffff,1.25);
    spotLight.position.set(50, 150, 50);
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 1;
    spotLight.shadowCameraFar = 500;
    spotLight.shadowCameraFov = 30;

    spotLight.castShadow = true;
    scene.add(spotLight);
}

function Scn(aplacer,options){

    placer = document.getElementById(aplacer) || document.body;
    options = options || {};

    scene = new THREE.Scene();

    createRenderer(options.renderer);
    createCamera(options.camera);
    createLight();
    controls = new THREE.OrbitControls(camera, placer, renderer.domElement);
    if(options.object){
        options.object.forEach(function(obj){
            fromURL(obj.mesh,obj.tex,obj.name,obj.callback);
        });
    }
}

Scn.prototype = {

    init:function(){
        placer.appendChild(renderer.domElement);
        onWindowResize();
        this.render();
    },
    render: function(){

        renderer.render(scene, camera);

        setTimeout( function() {
            dt = clock.getDelta();
            frameDelta += dt;
            console.log();
            while (frameDelta >= INV_MAX_FPS) {
                update(dt); // calculate physics
                frameDelta -= dt;
            }

            var emptyOBJ = new THREE.Object3D();
          	emptyOBJ.name = 'myEmptyObj';
          	scene.add( emptyOBJ );

            requestAnimationFrame(Scn.prototype.render);
            $(".comment-3d:not(.tabularasa)").each(function(index){
              var coords = $( this ).data('xyz');
              emptyOBJ.position.x = coords.x;
              emptyOBJ.position.y = coords.y;
              emptyOBJ.position.z = coords.z;
              coords = THREEx.ObjCoord.cssPosition(emptyOBJ, camera, renderer);
              $( this ).css('left', (5+coords.x)+'px');
              $( this ).css('top', (125+coords.y)+'px');
              $( this ).css('z-index', coords.z+10000);

            });

            $(".comment-3d-form").each(function(index){
              emptyOBJ.position.x = currentPoint.x;
              emptyOBJ.position.y = currentPoint.y;
              emptyOBJ.position.z = currentPoint.z;
              var coords = THREEx.ObjCoord.cssPosition(emptyOBJ, camera, renderer);
              console.log(coords)
              $( this ).css('left', (5+coords.x)+'px');
              $( this ).css('top', (125+coords.y)+'px');
              $( this ).css('z-index', coords.z+10000);

            });


            scene.remove(scene.getObjectByName('myEmptyObj'));

        }, 1000 * INV_MAX_FPS );

    }

};

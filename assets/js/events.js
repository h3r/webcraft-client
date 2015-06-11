window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    camera.aspect = placer.clientWidth / placer.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( placer.clientWidth , placer.clientHeight );
}

$('input[name="playpause"]').bootstrapSwitch({size:'mini',handleWidth:'50px',onText:'play',offText:'pause'});
$('input[name="playpause"]').on('switchChange.bootstrapSwitch', function(event, state) {
    setTimeout(function(){play = state;},150);
});
var id = 0;
var raycaster = new THREE.Raycaster(); // create once
var mouse = new THREE.Vector2(); // create once
document.getElementById('canvas-placer').addEventListener('click', onMouseDown, false);
function onMouseDown(e){
    mouse.x = ( event.offsetX / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( event.offsetY / renderer.domElement.height ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var objects = new Array();
    scene.getObjectByName("myObject").traverse(function(child){objects.push(child);});

    var intersects = raycaster.intersectObjects( objects );
    if(intersects[0]){



        var A = scene.getObjectByName("myObject").bounding_center;

        var hit = intersects[0].point;

        //b.subVectors(a,b);
        //b.normalize();
        //b.multiplyScalar( scene.getObjectByName("myObject").bounding_radius*2);
        //b.addVectors(scene.getObjectByName("myObject").bounding_center, b);

        createLine(A,hit,++id);
        //console.log(a,b,scene.getObjectByName("myObject").bounding_radius);
    }
        //console.log(intersects[0].point , $('.tooltip-inner').html());



}




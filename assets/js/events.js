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

var raycaster = new THREE.Raycaster(); // create once
var mouse = new THREE.Vector2(); // create once
document.getElementById('canvas-placer').addEventListener('click', onMouseDown, false);
function onMouseDown(e){
    console.log(event);
    mouse.x = ( event.offsetX / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( event.offsetY / renderer.domElement.height ) * 2 + 1;

    console.log(mouse);

    raycaster.setFromCamera( mouse, camera );
    var objects = new Array();
    scene.getObjectByName("myObject").traverse(function(child){objects.push(child);});

    var intersects = raycaster.intersectObjects( objects );
    console.log(intersects);

}




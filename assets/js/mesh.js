
    function createBox(){
        var boxGeometry = new THREE.BoxGeometry(5,5,5); //height width depth
        var boxMaterial = new THREE.MeshLambertMaterial({
            color: "red"
        });
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;

        return box;
    }

    function createPlane(){
        var planeGeometry = new THREE.PlaneGeometry(20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xcccccc
        });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.y = -2;

        return plane;
    }

    function createCircle(options){
        options = options || {};
        var material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });

        var radius = options.size ||20;
        var segments = 64;

        var circleGeometry = new THREE.CircleGeometry( radius, segments );
        var circle = new THREE.Mesh( circleGeometry, material);
        circle.receiveShadow = true;
        circle.rotateX(-0.5 * 3.1415);
        return circle;
    }

    function fromURL(modelURL,mtlURL,name,callback,options){
        if(options && options.start && options.end){
            loadResource(modelURL,name,options.start,options.end,callback);
            return;
        }

        // texture

        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };

        var texture = new THREE.Texture();

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };


        var loader = new THREE.ImageLoader( manager );
        loader.load( mtlURL, function ( image ) {

            texture.image = image;
            texture.needsUpdate = true;

        } );

        // model

        var loader = new THREE.OBJLoader( manager );

        loader.load( modelURL, function ( object ) {
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    child.transparent = true;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                }

            } );

            object.position.y = -2;
            object.name = name;
            object.castShadow = true;
            object.receiveShadow = true;

            if(callback)
                callback(object);

        }, onProgress, onError );
    }

    function loadResource(url,name,start,end,callback) {
        var total = end-start;
        var ok = 0;
        var failed = 0;

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
            failed++;
        };

        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        var loader = new THREE.OBJMTLLoader();
        loader.crossOrigin = "";
        var object = new THREE.Object3D();
        object.name = name;
        object.position.y = 0;
        var loader;
        for(var i = 0; i < end-start; i++){

            (function(){
                var y = i;
                var loader = new THREE.OBJMTLLoader();
                loader.load( url+(start+i)+'.obj', url+(start+i)+'.mtl', function ( slice ) {
                    slice.position.y += y ;
                    slice.children.forEach(function(sliceChild){

                        sliceChild.material.transparent = true;
                        sliceChild.castShadow = true;
                        sliceChild.receiveShadow = true;
                    });
                    object.add(slice);

                    ok++;
                    if(ok+failed == total){
                        console.log('download complete:');
                        console.log('succed:'+ok+' failed:'+failed);
                        callback(object);
                    }

                },onProgress, onError);
            })();
        }
    }

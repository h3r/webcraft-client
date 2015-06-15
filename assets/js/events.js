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
document.getElementById('canvas-placer').addEventListener('dblclick', onMouseDown, false);

///SEND/RECEIVE COMMENTS
var sendComment = function(obj, $callback){
  $.ajax({
    url:"sendcomment.php",
    type: "post",
    data :obj,
    dataType:"json",
    success: $callback
  });
}

var getComments = function($callback){
  obj = {};
  obj.a =getQueryVariable('a');
  obj.b =getQueryVariable('b');
  $.ajax({
    url:"getcomments.php",
    type: "post",
    data :obj,
    dataType:"json",
    success: $callback
  });
}
//SEND/RECEIVE COMMENTS
var currentPoint = new THREE.Vector3();

function onMouseDown(e){
    mouse.x = ( event.offsetX / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( event.offsetY / renderer.domElement.height ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var objects = new Array();
    scene.getObjectByName("myObject").traverse(function(child){objects.push(child);});

    var intersects = raycaster.intersectObjects( objects );
    if(intersects[0]){



        var A = scene.getObjectByName("myObject").box.center();
        var model = scene.getObjectByName("myObject").matrixWorld;
        var inverse = model.getInverse(model);
        var hit = (intersects[0].point).applyMatrix4( inverse );
        var b = new THREE.Vector3();
        b.subVectors(hit, A);
        b.normalize();
        b.multiplyScalar( scene.getObjectByName("myObject").bounding_radius);
        b.addVectors(scene.getObjectByName("myObject").box.center(), b);
        createLine(hit,b,++id);
        currentPoint = hit;
        $(".comment-3d-form").css('display','block');
        //console.log(a,b,scene.getObjectByName("myObject").bounding_radius);
    }
        //console.log(intersects[0].point , $('.tooltip-inner').html());
}

/*$('.comment-3d').on('click',function(ev){
    var e = ev.currentTarget.children[2].children[0];
    if(e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
});
*/

function getFormData(dom_query){
    var out = {};
    var s_data = $(dom_query).serializeArray();
    //transform into simple data/value object
    for(var i = 0; i<s_data.length; i++){
        var record = s_data[i];
        out[record.name] = record.value;
    }
    return out;
}



//given the list of comments, we
function updateComments(comments){
  comments = JSON.parse(comments);
  var blankslate = $('.comment-3d.tabularasa');
  $(".comment-3d:not(.tabularasa)").each(function(index){
    for(var j=0; j<comments.length;++j){
      if($( this ).children('.comment-3d-title').html() == comments[j].title){
        //update this one
        $( this ).children('.comment-3d-title').html(comments[j].title);
        $( this ).find('.comment-3d-text').html(comments[j].text);

        if(comments[j].comments){
          var replies = $( this).find('.comment-3d-replies');
          replies.empty();

          for(var k = 0; k< comments[j].comments.length; k++)
          replies.append( '<div class="comment-3d-reply">'+comments[j].comments[k]+'</div>' );

        }
        //replies.empty();
        //console.log(comments);


        //delete
        comments.splice(j, 1);
        return;

      }
    }

  });
  for(var j=0; j<comments.length;++j){
    var myComment = blankslate.clone();
    myComment.removeClass('tabularasa');
    myComment.children('.comment-3d-title').html(comments[j].title);
    myComment.find('.comment-3d-text').html(comments[j].content);
    myComment.css('display','block');
    myComment.appendTo($("#sheet"));
    myComment.data('xyz', JSON.parse(comments[j].xyz));


    myComment.find('.comment-3d-icon, .comment-3d-title').on('click', function(ev){
        var e = $(ev.target).parent().find('.comment-3d-content');
        if(e.css('display') == 'block')
            e.css('display','none');
        else
        e.css('display','block');
    });

    myComment.find('.reply-btn').click(function(e){
      alert("hola");
      //estoy demaciado dormido como para pensar esto bien. Que dios se apiade de nosotros
      var element = $(e.target).parent().parent().parent().parent();
      var dataToSend = {};
      dataToSend.a =getQueryVariable('a');
      dataToSend.b =getQueryVariable('b');
      dataToSend.comment = element.find(".my-reply").val();
      dataToSend.thread = element.find(".comment-3d-title").text();
      element.find(".my-reply").val("");
      sendComment(dataToSend,function(result){
        getComments(function(result){
      	   updateComments(result);
      	});
      });
    });

  }
}

$("form").submit(function(event){
    event.preventDefault();
    var form = getFormData(this);
    form.a =getQueryVariable('a');
    form.b =getQueryVariable('b');
    form['content'] = $("#newcontent").html();
    form['xyz'] = JSON.stringify(currentPoint);
    $(".comment-3d-form").css('display','none');
    sendComment(form,function(result){
      getComments(function(result){
    	   updateComments(result);
    	});
    });
});


setInterval(function(){
  getComments(function(result){
     updateComments(result);
  });
}, 5000)

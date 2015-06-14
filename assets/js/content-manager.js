'use strict';


function createThumb(title,cover,project){
    var thumbs_placer = document.getElementById('mine-articles');
    var count = thumbs_placer.querySelectorAll('div.thumb').length%3;
    var aux = project+'';
    aux = aux.replace(/\s/g,"-");
    aux = aux.replace(/[^a-zA-Z0-9-_]/g, '');
    var elHTML =
        '<div class="col-lg-4 thumb">'+
        '<a class="zoom green" href="work.html?a='+aux+'&b=0">' +
        '<img class="img-responsive" src="'+cover+'" alt="" />' +
        '</a>'+
        '<p>'+project+'</p>'+
        '</div>';
    if(count == 0){
        elHTML = '<div  class="row mt centered">'+elHTML+'</div>';
        thumbs_placer.insertAdjacentHTML( 'beforeend', elHTML );
    }else{
        thumbs_placer.lastChild.insertAdjacentHTML( 'beforeend', elHTML );
    }

}


function loadArticles(url){
    $.ajax({
        dataType: "json",
        url: url,
        success: function(articles){
            for(var article in articles){
                createThumb(articles[article][0].title,articles[article][0].cover,article);
            }
        }
    });
}
var miobj;
function loadArticleContent(url,a,b){

    a = a.replace(/-/g,' ');
    $.ajax({
        dataType: "json",
        url: url+'posts',
        success: function(articles){
            var article_placer = document.getElementById('article-placer');
            var article = articles[a][b];

            var myLength = Object.keys(articles[a]).length;
            //we've got some buttons
            if(parseInt(b)==0){
                $("#previous-book").hide();
            }else{
                $("#previous-book").attr("href", "work.html?a="+a+"&b="+b-1);
            }
            if(myLength==1 || parseInt(b)==myLength){
                $("#next-book").hide();
            }else{
                $("#next-book").attr("href", "work.html?a="+a+"&b="+(parseInt(b)+1));
            }


            document.title = 'Tinkraft - '+article.title;
            $('#article-title').html((article.title)? article.title : a);
            var str = '';
            if(article.pages.length > 1){
                for(var i=1; i< article.pages.length;i++){
                  var converter = new Showdown.converter();
                  var html = converter.makeHtml(article.pages[i]);
                    str += html;
                }
                article_placer.innerHTML = str;
            }

            fromURL(url+'projects/'+a+'/'+article.title+'/',url+'projects/'+a+'/'+article.title+'/','myObject',function(obj){

                $('#canvas-slider').slider({
                        max:obj.children.length,
                        value:obj.children.length}
                ).on('slide', function(e){
                        var sliderHide = parseInt($(".tooltip-inner").html());
                        for(var i=0; i<obj.children.length; i++){
                            if(obj["children"][i].position.y<sliderHide){
                                obj["children"][i]["visible"] = true;
                            }else{
                                obj["children"][i]["visible"] = false;
                            }
                        }
                    });
                controls.target.copy(obj.box.center());
                miobj = obj;
                scene.add(obj);
            },{start:parseInt(article.xyz[1]),end:parseInt(article.xyz[4])});

            //createThumb(articles[article][0].title,articles[article][0].cover,article);
        }
    });
}
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
var aID = 'a';
var articless = {a:{
    title:  'Welcome Again Minecraft!',
    id:1,
    cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
    body:   '<p>This is my <b>first</b> post!</p>' +
    '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
}};
var articles = new Array([

    {
        title:  'Welcome to Minecraft !',
        id:0,
        cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
        body:   '<p>This is my <b>first</b> post!</p>' +
        '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
    },
    {
        title:  'Welcome Again Minecraft!',
        id:1,
        cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
        body:   '<p>This is my <b>first</b> post!</p>' +
        '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
    },
    {
        title:  'Welcome to Minecraft !',
        id:2,
        cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
        body:   '<p>This is my <b>first</b> post!</p>' +
        '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
    },
    {
        title:  'Welcome Again Minecraft!',
        id:3,
        cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
        body:   '<p>This is my <b>first</b> post!</p>' +
        '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
    },
    {
        title:  'Welcome to Minecraft !',
        id:4,
        cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
        body:   '<p>This is my <b>first</b> post!</p>' +
        '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
    },
    {
        title:  'Welcome Again Minecraft!',
        id:5,
        cover:  'http://upload.wikimedia.org/wikipedia/en/c/c3/Minecraft_Volume_Alpha.jpg',
        body:   '<p>This is my <b>first</b> post!</p>' +
        '<img alt="" src="http://www.w3schools.com/html/html5.gif" style="width: 128px; height: auto" class="img-responsive">'
    }

]);

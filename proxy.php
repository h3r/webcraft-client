<?php
$url = $_GET['requrl'];
if(strpos($url, '.png') !== false){
    $filename = substr(strrchr($url, "/"), 1);

    echo file_get_contents("tex/".$filename);
}else{
    $file = file_get_contents($url);
    echo $file;
}
?>
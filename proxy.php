<?php


$url = $_GET['requrl'];

if(strpos($url, '.png') !== false){
    $filename = substr(strrchr($url, "/"), 1);

    echo file_get_contents("tex/".$filename);
}else if(strpos($url, '.obj') !== false or (strpos($url, '.mtl') !== false)){
	$needle = ':3000/';
	$filename = substr(strstr($url, $needle), strlen($needle));

	if(file_exists("cache/".$filename)){
		echo file_get_contents($url);
	}else{
		$folder = "cache/". substr($filename, 0,strrpos($filename, '/'));
		//die( var_dump ($folder));	
		if (!file_exists($folder)) {
			// folder isn't a dir
			mkdir($folder,'0777', true);
		}
		
		file_put_contents("cache/".$filename, fopen($url, 'r'));
		echo file_get_contents($url);
	}
	
   
}else{
	echo file_get_contents($url);
}
?>

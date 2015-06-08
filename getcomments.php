<?php

$received = $_POST;
$a = $received['a'];
$b = $received['b'];

$myFilename = 'db/'.$a."-".$b.".json";

if(file_exists($myFilename)){
  $temp_array = array();
  $temp_array = file_get_contents($myFilename);
  echo json_encode($temp_array);
}

?>

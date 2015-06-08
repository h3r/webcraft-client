<?php
$received = $_POST;
$a = $received['a'];
$b = $received['b'];

$myFilename = 'db/'.$a."-".$b.".json";

if(file_exists($myFilename))
{
    $temp_array = array();
    $temp_array = json_decode(file_get_contents($myFilename));
    array_push($temp_array, $received);
    file_put_contents($myFilename, json_encode($temp_array));
}
else
{
  $temp_array = array();
  array_push($temp_array,$received);
  file_put_contents($myFilename, json_encode($temp_array));
}

$response = array();
$response[result]= "ok";

echo json_encode($response);

?>

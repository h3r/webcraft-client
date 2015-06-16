<?php
$received = $_POST;
$a = $received['a'];
$b = $received['b'];
$reply = $received['comment'];
$thread = $received['thread'];
$myFilename = 'db/'.$a."-".$b.".json";

//var_dump($reply);


if($reply != NULL){

  $temp_array = array();
  $temp_array = json_decode(file_get_contents($myFilename));

  for ($i = 0; $i < count($temp_array); ++$i) {
    //var_dump($temp_array[$i]->{'title'},$thread);

    if($temp_array[$i]->{'title'}==$thread){
      if(array_key_exists ('comments',$temp_array[$i])){
        array_push($temp_array[$i]->{'comments'}, $reply);
        file_put_contents($myFilename, json_encode($temp_array));
      }else{
        $temp_array2 = array();
        array_push($temp_array2, $reply);
        $temp_array[$i]->{'comments'} = $temp_array2;

        file_put_contents($myFilename, json_encode($temp_array));
      }
    }
  }

}else{

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

}

$response = array();
$response[result]= "ok";

echo json_encode($response);

?>

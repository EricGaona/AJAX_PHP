<?php

include('database.php');

$search = $_POST['search'];
if(!empty($search)) {
  $query = "SELECT * FROM tareas WHERE name LIKE '$search%'";
  $result = mysqli_query($connection, $query);
  
  if(!$result) {
    die('Query Error' . mysqli_error($connection));
  }
  
  // aqui estamos creando un array para luego llenarlo con mas arrays en el while
  $json = array();
  while($row = mysqli_fetch_array($result)) {
    $json[] = array(
      'name' => $row['name'],
      'description' => $row['description'],
      'id' => $row['id']
    );
  }
  // convertimos el array en un JSON
  $jsonstring = json_encode($json);
  echo $jsonstring;
}

?>
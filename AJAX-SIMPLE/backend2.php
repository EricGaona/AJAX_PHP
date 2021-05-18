<?php

if(isset($_POST)) {
  echo "Usuario: " . $_POST['username'];
  echo '<br>';
  echo "Clave: " . $_POST['password'];
}
  
  #echo 'Working!';

?>
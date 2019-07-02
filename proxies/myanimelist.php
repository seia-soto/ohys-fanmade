<?php
$BaseURL = "https://myanimelist.net/";
echo file_get_contents($BaseURL."search/prefix.json?".$_SERVER['QUERY_STRING']);
 ?>

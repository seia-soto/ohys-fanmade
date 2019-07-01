<?php
$BaseURL = "https://myanimelist.net/search/";
echo file_get_contents($BaseURL."prefix.json?".$_SERVER['QUERY_STRING']);
 ?>

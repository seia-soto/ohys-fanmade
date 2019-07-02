<?php
$BaseURL = "https://torrents.ohys.net/t/";
echo file_get_contents($BaseURL."json.php?".$_SERVER['QUERY_STRING']);
 ?>

<?php

include 'key.php';
$lang = GET("lang");
$page = GET("page");
$cidn = GET("cidn");

if( !isset($cidn) ){
    $resultaat = file_get_contents("http://api.artsholland.com/rest/venue?apiKey=$apiKey&lang=$lang&page=$page");
} else {
    $resultaat = file_get_contents("http://api.artsholland.com/rest/venue/$cidn?apiKey=$apiKey&lang=$lang");
}

echo $resultaat;

/*
 * Function to get the $_GET values with the isset check
 */
function GET($key, $default=null) {
    return isset($_GET[$key]) ? $_GET[$key] : $default;
}
?>

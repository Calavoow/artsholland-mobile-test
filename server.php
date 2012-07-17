<?php
header("Access-Control-Allow-Origin: *");

include 'key.php';
$lang = GET("lang");
$page = GET("page");
$cidn = GET("cidn");
$lat = GET("lat");
$long = GET("long");
$distance = GET("distance");
$search = GET("search");

$urlstring = "";

if( isset($cidn) ){
    $resultaat = file_get_contents("http://api.artsholland.com/rest/venue/$cidn?apiKey=$apiKey&lang=$lang");    
} elseif( isset($lat) && isset($long) && isset($distance) && isset($page) ){
    $nearbyEncoded = urlencode("POINT(".$long." ".$lat.")");
    $urlstring = "http://api.artsholland.com/rest/venue?apiKey=$apiKey&lang=$lang&nearby=$nearbyEncoded&distance=$distance&page=$page";
    $resultaat = file_get_contents($urlstring);
} elseif ( isset($search) && isset($page) ) {
    $urlstring = "http://api.artsholland.com/rest/venue?apiKey=$apiKey&lang=$lang&page=$page&search=$search";
    $resultaat = file_get_contents($urlstring);
} else {
    $resultaat = file_get_contents("http://api.artsholland.com/rest/venue?apiKey=$apiKey&lang=$lang&page=$page");
}

echo $resultaat;

/*
 * Function to get the $_GET values with the isset check
 */
function GET($key, $default=null) {
    return isset($_GET[$key]) ? $_GET[$key] : $default;
}
?>

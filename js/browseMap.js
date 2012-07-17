var distanceLayers = new L.LayerGroup();
var browseCircle;
var browseMap;
var latitude = 51.918427;
var longitude = 4.523279;
var browseRange = 2000;
var browseUpdating = false;

function loadMap(){
    console.log("Loading map");
    var mapHeight = $(window).height() - $('div[data-role="header"]').outerHeight()
    -$('#browseRangeContainer').outerHeight() - 2*parseInt($("#browseMapContent").css("padding"));
    $('#browseLeafletMap').css("height", mapHeight);
    console.log($('#browseLeafletMap').height());
    browseMap = new L.Map('browseLeafletMap');

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 6,
        //                maxZoom: 18,
        attribution: osmAttrib
    });
    var latlng = new L.LatLng(latitude, longitude);
    browseMap.setView(latlng,12);
    browseMap.addLayer(osm);
    browseMap.addLayer(distanceLayers);

    //Set start position
    var marker = new L.Marker(latlng);
    browseMap.addLayer(marker);

    //Show search radius
    var circleOptions = {
        color: '#00ABE6',
        fillColor: '#E9F2F5',
        fillOpacity: 0.2
    };
    browseCircle = new L.Circle(latlng, browseRange, circleOptions);
    distanceLayers.addLayer(browseCircle);
    addNearbyLocations(latlng, browseRange);
}

function addNearbyLocations(latlng, range, page){

    browseUpdating=true;
    if(typeof page === 'undefined') page = 1;
    //console.log(latlng);
    $.getJSON("http://localhost/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "lat" : latlng.lat,
        "long": latlng.lng,
        "page": page,
        "distance": range
    }, function(data){
        var perPage = parseInt(data["metadata"]["per_page"]);
        var results = data["results"];
        var itemsOnThisPage = results.length;

        //Recursively make sure all locations are added to the map
        if( itemsOnThisPage === perPage ){
            addNearbyLocations(latlng, range, page+1);
        }

        $.each(results, function(index, value){
            //console.log(value);
            var latitude = value["lat"];
            var longitude = value["long"];
            var venueLatLng = new L.LatLng(latitude, longitude);
            var marker = new L.Marker(venueLatLng);

            var title = value["title"];
            var cidn = value["cidn"];
            var popupText = '<h4>'+ title +'</h4><p><a onclick="showDetails(\''+cidn+'\')">More info</a></p>';
            marker.bindPopup(popupText);
            distanceLayers.addLayer(marker);

        });
    }).complete(function(){
        browseUpdating = false;
    });
}

function refreshNearbyLocations(){
    var newRange = $("#browseRange").val() * 1000;
    if( newRange === browseRange){
        return;
    }
    browseCircle.setRadius(newRange);
    window.setTimeout(function(){
        console.log("timer finished");
        var currentSliderRange = $("#browseRange").val()*1000;
        console.log(currentSliderRange+' stored range: '+newRange);
        //Only update when there is no change for 1 second.
        if(currentSliderRange===newRange){
            console.log("updating");
            browseRange = newRange;
            browseMap.removeLayer(distanceLayers);
            distanceLayers = new L.LayerGroup();
            browseMap.addLayer(distanceLayers);

            var currentPosition = new L.LatLng(latitude, longitude)

            distanceLayers.addLayer(browseCircle);

            console.log("AddnearbyLocations")
            addNearbyLocations(currentPosition, browseRange);
        }
    }, 1000);
}

function refreshBrowseCircle(){
    var newRange = $("#browseRange").val() * 1000;
    browseCircle.setRadius(newRange);
}

function showDetails(cidn){
    console.log($(this));
    $.mobile.changePage('venuedetails.html?cidn='+cidn,{
        transition:"slideup"
    });
}
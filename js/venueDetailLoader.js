$(document).on("pageshow", function pageshow(){
    console.log("Veneu details");
    console.log(JSON.stringify(getUrlVars()));
    getVenueDetails(getUrlVars()["cidn"]);
    pageUnloader = function(){
        console.log("Details deleted");
        $(document).off("pageshow",pageshow);
    }
});

var map;

function getVenueDetails(cidn){
    console.log(cidn);
    $.mobile.showLoadMsg = true;
    $.getJSON("http://localhost/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "cidn": cidn
    }, function(data){
        venueDetails = data["results"][0];
        
        var title2 = venueDetails["title"];
        console.log(title2);
        $("#detailedVenuetitle").html(title2);
        var contentHtml = '';
        
        var description;
        if(isset(venueDetails["description"])){
            description = venueDetails["description"];            
        } else {
            description = venueDetails["shortDescription"];
        }        
        if(isset(description)){
            addContentPane("Description", prepareTextContent(description), "venueDetailsDescription");
        //            contentHtml += '<div data-role="fieldcontain"><p>' + stripHtml(description) + '</p></div>';
        }
        
        var openingHours = venueDetails["openingHours"];
        if(isset(openingHours)){
            addContentPane("Opening Hours", prepareTextContent(openingHours), "venueDetailsOpeningHours");
        }
        
        var latitude = venueDetails["lat"];
        var longitude = venueDetails["long"];
        if( isset(latitude) && isset(longitude)){
            console.log(latitude + ' long: ' + longitude );
            var mapHtml = '<div style="width:80; height:400px;" id="leafletMap"></div>'
            addContentPane("Map", mapHtml, "venueDetailsMap");
            map = new L.Map('leafletMap');
            
            // create the tile layer with correct attribution
            var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib='Map data © OpenStreetMap contributors';
            var osm = new L.TileLayer(osmUrl, {
                minZoom: 8, 
                maxZoom: 18, 
                attribution: osmAttrib
            });		

            // start the map in South-East England
            map.setView(new L.LatLng(latitude, longitude),12);
            map.addLayer(osm);
            var latlng = new L.LatLng(latitude, longitude);
            var marker = new L.Marker(latlng);
            map.addLayer(marker);
            
        }
        var attachment = venueDetails["attachment"];
        if(isset(attachment)){
            
        }
        $("#detailedVenueNavbar").parent("div").navbar();
        //Activate the correct navbar button and show the corresponding element.
        $("#"+$("#detailedVenueNavbar").children("li").first().children("a").first().addClass('ui-btn-active').attr('contentPane-href')).show();
        
        $("#detailedVenueNavbar").on('tap', 'a',  function(event){
            navBarActivate($(this));
        })
    }).always(function(){
        $.mobile.showLoadMsg = false;
    });
}

function addContentPane(title, data, id){
    $("#detailedVenueNavbar").append("<li><a contentPane-href="+id+'>'+title+'</a></li>');
    $("#detailedVenueContent").append('<div id="'+id+'" class="contentPane">' + data + '</div>');
}

function prepareTextContent(content){
    return "<p>" + stripHtml(content) + '</p>';
}

function navBarActivate(anchor){
    $(".contentPane").hide();
    $("#"+anchor.attr('contentPane-href')).show();
    map.invalidateSize();
}
var map;
var venueDetails = {};

venueDetails.loadCidn = function(cidn){
    console.log(cidn);
    $.mobile.showLoadMsg = true;
    $.getJSON("http://localhost/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "cidn": cidn
    }, function(data){
        console.log($("#detailedVenueTitle"));
        venueResults = data["results"][0];
        
        var title2 = venueResults["title"];
        console.log(title2);
        $("#detailedVenueTitle").html(title2);
        
        var description;
        if(isset( typeof venueResults["description"])){
            description = venueResults["description"];
        } else {
            description = venueResults["shortDescription"];
        }        
        if(isset( typeof description)){
            venueDetails.addContentPane("Description", venueDetails.prepareTextContent(description), "venueDetailsDescription");
        //            contentHtml += '<div data-role="fieldcontain"><p>' + stripHtml(description) + '</p></div>';
        }
        
        var openingHours = venueResults["openingHours"];
        if(isset( typeof openingHours)){
            venueDetails.addContentPane("Opening Hours", venueDetails.prepareTextContent(openingHours), "venueDetailsOpeningHours");
        }

        var homepage = venueResults["homepage"];
        if( isset( typeof homepage)){
            var linkHtml = '<a href="'+homepage+'" target="_blank">'+homepage+'</a>';
            venueDetails.addContentPane("Website", linkHtml, "venueDetailsHomepage");
        }
        
        var latitude = venueResults["lat"];
        var longitude = venueResults["long"];
        if( isset( typeof latitude) && isset( typeof longitude)){
            console.log(latitude + ' long: ' + longitude );
            var mapHeight = $(window).height() -107;
            var mapHtml = '<div style="height:'+mapHeight+'px;" id="leafletMap"></div>'
            venueDetails.addContentPane("Map", mapHtml, "venueDetailsMap");
            map = new L.Map('leafletMap');
            
            // create the tile layer with correct attribution
            var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib='Map data © OpenStreetMap contributors';
            var osm = new L.TileLayer(osmUrl, {
                minZoom: 6,
//                maxZoom: 18,
                attribution: osmAttrib
            });		

            // start the map at the location of the Venue
            var latlng = new L.LatLng(latitude, longitude);
            map.setView(latlng,12);
            map.addLayer(osm);
            
            var marker = new L.Marker(latlng);
            map.addLayer(marker);
            
        }
        var attachment = venueResults["attachment"];
        if(isset( typeof attachment)){
            
        }
        $("#detailedVenueNavbar").parent("div").navbar();
        //Activate the correct navbar button and show the corresponding element.
        $("#"+$("#detailedVenueNavbar").children("li").first().children("a").first().addClass('ui-btn-active').attr('contentPane-href')).show();
        
        $("#detailedVenueNavbar").on('tap', 'a',  function(event){
            venueDetails.navBarActivate($(this));
        })
    }).always(function(){
        console.log("AJAX request in venueDetail complete");
    });
};

venueDetails.addContentPane = function(title, data, id){
    $("#detailedVenueNavbar").append("<li><a contentPane-href="+id+'>'+title+'</a></li>');
    $("#detailedVenueContent").append('<div id="'+id+'" class="contentPane">' + data + '</div>');
};

venueDetails.prepareTextContent = function(content){
    return "<p>" + stripHtml(content) + '</p>';
};

venueDetails.navBarActivate = function(anchor){
    $(".contentPane").hide();
    $("#"+anchor.attr('contentPane-href')).show();
    map.invalidateSize();
};
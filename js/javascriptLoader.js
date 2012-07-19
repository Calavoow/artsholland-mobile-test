var currentPageId;

$(document).on('pagebeforeshow', function(event){
    currentPageId = $(event.target).attr("id");
    switch (currentPageId) {
        case "venues":
            loadVenues();
            break;
        case "venueDetails":
            loadVenueDetails();
            break;
        case "browseMap":
            loadBrowseMap();
            break;
        case "searchVenues":
            loadSearchVenues();
            break;
        default:
            break;
    }
});


function loadVenues(){
    $(document).on("pageshow", function pageshow(event){
        venuesPage = $.mobile.activePage;
        console.log("venues");
        updateVenues();

        $(window).on("scrollstart", updateVenues);
        $(window).on("scrollstop", updateVenues);
        
        $(document).on("pagebeforeshow", function pagebeforeshow(event){
            console.log("Venues deleted")
            $(document).off('pageshow', pageshow);
            $(window).off("scrollstart", updateVenues);
            $(window).off("scrollstop", updateVenues);
            $(document).off("pagebeforeshow", pagebeforeshow);
        });
    });
}

function loadVenueDetails(){
    $(document).on("pageshow", function pageshow(){
        console.log("Venue details");
        venueDetails.loadCidn(getUrlVars()["cidn"]);
        $(document).on("pagebeforeshow", function pagebeforeshow(event){
            console.log("Details deleted");
            $(document).off("pageshow",pageshow);
            $(document).off("pagebeforeshow", pagebeforeshow);
        });
    });
}

function loadBrowseMap(){
    $(document).on("pageshow", function pageshow(){
        console.log("Browse Map");
        if(typeof browseMap === "undefined"){
            loadMap();
        }
        $("#browseRange").on("change", function(event){
            refreshBrowseCircle();
        })
        $("#browseRange").on("vmouseup", function(event){
            refreshNearbyLocations();
        });
        $("#browseRange").next().on("vmouseup", 'a', function(event){
            refreshNearbyLocations();
        });
        $(document).on("pagebeforeshow", function pagebeforeshow(event){
            console.log("BrowseMap deleted");
            $(document).off("pageshow",pageshow);
            $(document).off("pagebeforeshow", pagebeforeshow);
        });
    })
}

function loadSearchVenues(){
    $(document).on("pageshow", function pageshow(){
        $("#searchVenueList").prev().on("keyup",function(){
            updateSearchVenues();
        });
        $("#searchVenueList").listview('option', 'filterCallback', function(text, searchValue){
            return text.toLowerCase().indexOf( searchValue ) === -1;
        });
        $(document).on("pagebeforeshow", function pagebeforeshow(event){
            console.log("searchVenues deleted");
            $(document).off("pageshow",pageshow);
            $(document).off("pagebeforeshow", pagebeforeshow);
        });
    })
}
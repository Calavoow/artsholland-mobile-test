$(document).on('pagebeforeshow', function(event){
    var pageId = $(event.target).attr("id");
    switch(pageId){
        case "venues": loadVenues(); break;
        case "venueDetails": loadVenueDetails(); break;
        default: break;
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
            console.log("Veneus deleted")
            console.log($(this));
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
        getVenueDetails(getUrlVars()["cidn"]);
        $(document).on("pagebeforeshow", function pagebeforeshow(event){
            console.log("Details deleted");
            $(document).off("pageshow",pageshow);
            $(document).off("pagebeforeshow", pagebeforeshow);
        })
    });
}
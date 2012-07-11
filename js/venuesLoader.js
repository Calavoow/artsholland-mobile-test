var currentPage = 1;
//To prevent double update because of scrollstart AND stop events.
var alreadyUpdating = false;

$(document).on("pageshow", function pageshow(event){
    console.log("venues");
    updateVenues();
    
    $(window).on("scrollstart", updateVenues);
    $(window).on("scrollstop", updateVenues);
    pageUnloader = function(){
        console.log("Veneus deleted")
        $(document).off('pageshow', pageshow);
        $(window).off("scrollstart", updateVenues);
        $(window).off("scrollstop", updateVenues);
        currentPage = null;
        alreadyUpdating=null;
    }
});

function updateVenues(){
    if( isAtBottom() && !alreadyUpdating){
        console.log("updating Veneus");
        alreadyUpdating = true;
        addVenues(currentPage);
    }
}

function addVenues(page){    
    $.getJSON("http://localhost/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "page" : page
    }, function(data){
        var venues = {};
        var shortdescriptions = {}        
        $.each(data["results"], function(index, value){
            console.log(value["title"]);
            var cidn = value["cidn"];
            venues[cidn] = value["title"];
            
            
            var unfilteredShortDescription = value["shortDescription"];
            if(isset(unfilteredShortDescription)){
                
                var shortDescription = stripHtml(unfilteredShortDescription);
            
                console.log("has shortdescription: " + shortDescription);
                shortdescriptions[cidn] = shortDescription;
            }
        });
        console.log(JSON.stringify(shortdescriptions));
        $.each(venues, function(cidn, title){
            console.log(title);
            var buttonHtml = '<li><a href="venuedetails.html?cidn='+cidn+'" >' + title;
            //If there is a shortDescription add it.
            if(isset(shortdescriptions[cidn])){
                buttonHtml += '<p class="shortDescription">' + shortdescriptions[cidn] + '</p>';
            }
            buttonHtml += '</a></li>'
            $("#venueList").append(buttonHtml).listview("refresh");
        });
    //$("#results").innerHTML = data.toString();
    }).always(function(){
        currentPage++;
        alreadyUpdating = false;
        //Update again if necessary
        updateVenues();
    });
}

function isAtBottom(){
    var body = document.body
    var html = document.documentElement;

    var totalHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );

    //    console.log(
    //        'total height: ' + totalHeight + ' ' +
    //        'visibleHeight : ' + $(window).height() + ' ' +
    //        'currentScroll:' + $(window).scrollTop());
    return (totalHeight-50 <= $(window).height() + $(window).scrollTop() );
}
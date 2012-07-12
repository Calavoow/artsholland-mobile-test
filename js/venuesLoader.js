var currentPage = 1;
//To prevent double update because of scrollstart AND stop events.
var alreadyUpdating = false;
var venuesPage;



function updateVenues(){
    if( isAtBottom() && !alreadyUpdating && $.mobile.activePage == venuesPage){
        console.log("updating Veneus");
        alreadyUpdating = true;
        addVenues(currentPage);
    }
}

function addVenues(page){
    currentRequest = $.getJSON("http://10.0.135.119/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "page" : page
    }, function(data){
        console.log(typeof data);
        var venues = {};
        var shortdescriptions = {}
        $.each(data["results"], function(index, value){
            //console.log(value["title"]);
            var cidn = value["cidn"];
            venues[cidn] = value["title"];


            var unfilteredShortDescription = value["shortDescription"];
            if(isset( typeof unfilteredShortDescription)){

                var shortDescription = stripHtml(unfilteredShortDescription);

                //console.log("has shortdescription: " + shortDescription);
                shortdescriptions[cidn] = shortDescription;
            }
        });
        //console.log(JSON.stringify(shortdescriptions));
        $.each(venues, function(cidn, title){
            //console.log(title);
            var buttonHtml = '<li><a href="venuedetails.html?cidn='+cidn+'" >' + title;
            //If there is a shortDescription add it.
            if(isset( typeof shortdescriptions[cidn])){
                buttonHtml += '<p class="shortDescription">' + shortdescriptions[cidn] + '</p>';
            }
            buttonHtml += '</a></li>';
            $("#venueList").append(buttonHtml).listview("refresh");
        });
    }).always(function(){
        console.log("leavePage check: " + currentPage + '/' + alreadyUpdating);
        alreadyUpdating = false;
        currentPage++;
        updateVenues();
    });
}

function isAtBottom(){
    var body = document.body
    var html = document.documentElement;

    var totalHeight = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );

    return (totalHeight-50 <= $(window).height() + $(window).scrollTop() );
}
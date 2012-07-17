var currentPage = 1;
//To prevent double update because of scrollstart AND stop events.
var alreadyUpdating = false;



function updateVenues(){
    if( isAtBottom() && !alreadyUpdating){
        console.log("updating Veneus");
        alreadyUpdating = true;
        addVenues(currentPage);
    }
}

function addVenues(page){
    currentRequest = $.getJSON("http://localhost/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "page" : page
    }, function(data){
        //console.log(typeof data);
        var venues = {};
        //var shortdescriptions = {}
        $.each(data["results"], function(index, value){
            //console.log(value["title"]);
            var cidn = value["cidn"];
            venues[cidn] = {};
            venues[cidn]["title"] = value["title"];


            var unfilteredShortDescription = value["shortDescription"];
            if(isset( typeof unfilteredShortDescription)){

                var shortDescription = stripHtml(unfilteredShortDescription);

                //console.log("has shortdescription: " + shortDescription);
                venues[cidn]["shortdescription"] = shortDescription
                //shortdescriptions[cidn] = shortDescription;
            }
        });
        //console.log(JSON.stringify(shortdescriptions));
        $.each(venues, function(cidn, object){
            //console.log(title);
            var listItem = $(document.createElement("li"));
            var listItemHtml = '<a href="venuedetails.html?cidn='+cidn+'" >' + object["title"];
            //If there is a shortDescription add it.
            if(isset( typeof object["shortdescription"])){
                listItemHtml += '<p class="shortDescription">' + object["shortdescription"] + '</p>';
            }
            listItemHtml += '</a>';
            listItem.append(listItemHtml);
            $("#venueList").append(listItem).listview("refresh");
        });
    }).always(function(){
        console.log("leavePage check: " + currentPage + '/' + alreadyUpdating);
        alreadyUpdating = false;
        currentPage++;
        if( currentPageId === "venues"){
            updateVenues();
        }
    });
}
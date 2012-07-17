var currentSearchPage = 1;
//To prevent double update because of scrollstart AND stop events.
var alreadySearchUpdating = false;
var previousSearchValue;
var searchResultsComplete = false;



function updateSearchVenues(){
    var currentSearchValue = getSearchValue();
    if( (previousSearchValue !== currentSearchValue || isAtBottom() && !searchResultsComplete)
        && !alreadySearchUpdating){
        console.log("updating searchVeneus");
        alreadySearchUpdating = true;
        addSearchVenues(currentSearchPage, currentSearchValue);
    }
}

function addSearchVenues(page, search){
    currentRequest = $.getJSON("http://localhost/ArtsHollandMobile/server.php",
    {
        "apiKey": artsHollandAPIKey,
        "lang": "nl",
        "page" : page,
        "search": search
    }, function(data){
        console.log(typeof data);
        var perPage = data["metadata"]["per_page"];
        if( data["results"].length < perPage ){
            console.log("search results complete")
            searchResultsComplete = true;
        }
        var venues = {};
        //var shortDescriptions = {}
        $.each(data["results"], function(index, value){
            var cidn = value["cidn"];

            //Skip any already added cidn. They will be filtered by jQM
            if(alreadyAdded(cidn)){
                return;
            }

            venues[cidn] = {};
            venues[cidn]["title"] = value["title"];

            var unfilteredShortDescription = value["shortDescription"];
            if(isset( typeof unfilteredShortDescription)){

                var shortDescription = stripHtml(unfilteredShortDescription);

                venues[cidn]["shortDescription"] = shortDescription;
            }
            var unfilteredDescription = value["Description"];
            if(isset(typeof unfilteredDescription)){
                var description = stripHtml(unfilteredDescription);

                venues[cidn]["description"] = description;
            }
        });
        //console.log(JSON.stringify(shortDescriptions));
        $.each(venues, function(cidn, object){
            var listItem = $(document.createElement("li"));
            var listItemHtml = '<a href="venuedetails.html?cidn='+cidn+'" >' + object["title"];
            //If there is a shortDescription add it.
            if(isset( typeof object["shortdescription"])){
                listItemHtml += '<p class="shortDescription">' + object["shortdescription"] + '</p>';
            }
            listItemHtml += '</a>';
            listItem.append(listItemHtml);
            if(isset( typeof object["description"])){
                listItem.data(filtertext, object["description"]);
            }
            $("#searchVenueList").append(listItem).listview("refresh");
        });
    }).always(function(){
        console.log("leavePage check: " + currentSearchPage + '/' + alreadySearchUpdating);
        alreadySearchUpdating = false;
        currentSearchPage++;
        previousSearchValue = search;
        updateSearchVenues();
    });
}

function getSearchValue(){
    return $('#searchVenueList').prev('form[role="search"]').find('input[data-type="search"]').val();
}

function alreadyAdded(cidn){
    var element = $("li").find("data-cidn'"+cidn+"']");
    return element.length !== 0;
}
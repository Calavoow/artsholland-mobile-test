function isset(argument){
    return argument != 'undefined';
}

function stripHtml(unfilteredString){
    //Filter the HTML tags from the shortDescr's.
    var div = document.createElement("div");
    div.innerHTML = unfilteredString;
    return div.textContent || div.innerText || "";
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function isAtBottom(){
    var body = document.body
    var html = document.documentElement;

    var totalHeight = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );

    return (totalHeight-1000 <= $(window).height() + $(window).scrollTop() );
}
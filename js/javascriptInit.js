var pageUnloader = function(){
    return;
};

/*
 * Needs to initialize before jQueryMobile is loaded.
 */
$(document).on("mobileinit",function(){
    $.extend( $.mobile, {
        defaultPageTransition : "slide"
    })
});
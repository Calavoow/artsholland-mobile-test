ArtsHolland-Mobile-test
=======================

A test mobile application for the Arts Holland platform of Waag Society.
It uses [jQuery](http://jquery.com/), [jQueryMobile](http://jquerymobile.com/) and [Apache Phonegap (Cordova)](http://phonegap.com/).

###Required Files
For this application to work you will need an ArtsHolland API key. You can get one
at http://dev.artsholland.com. When you have an API-key, there are 2 files that
need to be created:
```
key.php
js/key.js
```

Inside the key.php is the following:
```php
<?php
    $apiKey = API-KEY;
?>
```

Inside the key.js is the following:
```javascript
var artsHollandAPIkey = API-KEY;
```

And you're almost set. The next (and last) step is to host an apache server so that
the server.php is hosted for the proxy to the ArtsHolland server. Then you can connect
to your server and start up the index.html.
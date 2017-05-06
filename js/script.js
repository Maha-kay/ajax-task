
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetSts = $('#street').val();
    var cityStr = $('#city').val();
    // "," because google street url uses comma 
    var address = streetSts + ',' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');
    // http://maps.googleapis.com/maps/api/streetview?size=600x300&location= this the URL , the I will add the address
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';

    $body.append('<img class="bgimg" src=" '+ streetviewURL+ ' ">');

    // NYtimes AJAX
    var nyTimesURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&api-key=b54e4cde1868403587cb59e7302b24b6';
    $.getJSON(nyTimesURL, function(data) {
    	$nytHeaderElem.text('New York Times Articles abount '+ cityStr);
    	console.log(data.response);
        articles = data.response.docs;
    	for (var i = 0; i < articles.length; i++ ) {
    		var article = articles[i];
    		$nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');

    	};
    }).error(function(e){
    $nytHeaderElem.text(' New York Times Article cannot be loaded');
  });


    // wikipedia err handling
    var wikirequestTimeout = setTimeout(function() {
        $wikiElem.text('failed to get wikipedia resources');
    },8000);

    // wikipedia ajax
    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';
    // json P method
    $.ajax(wikiURL,{
        // url: wikiURL, all works
        dataType : "jsonp",
        success  : function(response) {
            var articleList = response[1];
            for (i=0; i<articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li> <a href="'+ url +'">' + articleStr+ '</a></li>');
            };
            clearTimeout(wikirequestTimeout); // because if it success we need to clear timeout err message

        }

    });

    return false;
};

$('#form-container').submit(loadData);

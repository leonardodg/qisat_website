// Using <base href/> with Anchors
// $('.include-header').on("click", ".clickhash", function() {
// 	var link = $(this).attr('href');
// 		if (link.substr(0,1) == "#")
// 	    	document.location.hash = link;
// 	return false;
// });

$(document).ready(function(){

	$('a').on("click", function() {
		var link = $(this).attr('href');
		if (link.substr(0,1) == "#"){
	    	document.location.hash = link;
	    	return false;
		}
	});

});
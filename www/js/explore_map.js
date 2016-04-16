var map;
var geocoder;

function initMap() {
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.481, lng: -122.011},
		zoom: 10,
		mapTypeControl: false,
	});

	initialize();
}

function initialize() {
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(centerPosition);
    }
    else {
    	console.log('no geolocation');
    }
	getBusinessReviews();
}

function centerPosition(position) {
	pos = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	};

	map.setCenter(pos);
}

function getBusinessReviews(location) {
	var oauth = OAuth({
	    consumer: {
	        public: 'e6LruJRB-6b6Bi7ysURVWQ',
	        secret: 'bmzjuJFg6YYQdxHpBz8-ek3ZP84'
	    },
	    signature_method: 'HMAC-SHA1'
	});

	var token = {
	    public: 'GNo8PmC7czOypB8IZMqtAIxVqNKRE146',
	    secret: 'raZPy2dzedoQwXQdZT9oHyKlkA8'
	};

	var request_data = {
	    url: 'https://api.yelp.com/v2/search?term=corporate&bounds=37.900000,-122.500000|37.788022,-122.399797',
	    method: 'GET'
	};

	$.ajax({
	    url: request_data.url,
	    type: request_data.method,
	    data: oauth.authorize(request_data, token),
	}).done(function(data) {
	    console.log(data);
	    for (var i = 0; i < data.businesses.length; i++) {
	    	dropClickableMarker(data.businesses[i]);
	    }
	});

	//while waiting for the data, initialize other listener
	$('#close').click(function() {
		$("#event_info_window").css('z-index', '-10');
	});
}

function dropClickableMarker(business) {
	var address = business.location.address[0];
	if (address == null) {
		pos = {
			lat: business.location.coordinate.latitude,
			lng: business.location.coordinate.longitude
		};
		var marker = getMarkerFromCoords(pos);
		markerClick(marker, business);
	}
	else {
		address = address + " " + business.location.city;
		address = address + " " + business.location.state_code;
		address = address + " " + business.location.postal_code;
		getMarkerFromAddress(business, address);
	}
}

function markerClick(marker, business) {
	marker.addListener('click', function() {
		$('#event_host').html(business.name);
		$("#event_info_window").css("z-index", "10");
		getRating(business);
		$("#host_image").attr("src", business.image_url);
	});
}

function getMarkerFromAddress(business, address) {
	var marker;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			//callback function because it is asynchronous
			markerClick(marker, business);
		}
		else {
			console.log('Geocode was not successful: ' + status);
		}
	});
}

function getMarkerFromCoords(location) {
	var marker = new google.maps.Marker({
		map: map,
		position: location
	});
	return marker;
}

function getRating(business) {
	var rating = business.rating;
	$("#rating").html("");
	for (var i = 0; i < 5; i++) {
		if (rating >= 1) {
			$("#rating").append('<img class="star" src="icon/full_star.jpg" />');
			rating -= 1;
		}
		else if (rating == 0.5) {
			$("#rating").append('<img class="star" src="icon/half_star.jpg" />');
			rating -= 0.5;
		}
		else {
			$("#rating").append('<img class="star" src="icon/empty_star.jpg" />');
		}
	}
	$("#rating").append(" " + business.review_count + " reviews");
}
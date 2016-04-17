
$(document).ready(function() {

	// listeners
	setListeners();

	var myFirebaseRef = new Firebase("https://connect-app.firebaseio.com/events");

	myFirebaseRef.on("value", function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var businessEvent = childSnapshot.val();
			getBusinessReviews(businessEvent);
		});
	});
});

function setListeners() {
	$("#logout").click(function() {
		window.location.href = "create_event.html";
	});
}


function getBusinessReviews(businessEvent) {

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
	    url: 'https://api.yelp.com/v2/business/' + businessEvent.businessID,
	    method: 'GET'
	};

	$.ajax({
	    url: request_data.url,
	    type: request_data.method,
	    data: oauth.authorize(request_data, token),
	}).done(function(data) {
	    console.log(data);
	    addEvent(data);
	    $('#load').remove();
	});

	//loading
	$('body').append('<div id="load">\
		<img src="img/loader.gif" />\
		</div>');
}

function addEvent(business) {
	var appendStr = '<li class="event">\
	<h2>' + business.name + '</h2>\
	<img class="event_img" src="' + business.image_url +'" />\
	<div class="event_info">'
	+ getRating(business) +
	'</div>\
	</li>';
	$('#events').append(appendStr);
}

function getRating(business) {
	var rating = business.rating;
	var htmlStr = '<div class="rating">';
	for (var i = 0; i < 5; i++) {
		if (rating >= 1) {
			htmlStr += '<img class="star" src="icon/full_star.jpg" />';
			rating -= 1;
		}
		else if (rating == 0.5) {
			htmlStr += '<img class="star" src="icon/half_star.jpg" />';
			rating -= 0.5;
		}
		else {
			htmlStr += '<img class="star" src="icon/empty_star.jpg" />';
		}
	}
	htmlStr = htmlStr + " " + business.review_count + " reviews</div>";
	return htmlStr;
}
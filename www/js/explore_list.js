var events = [];
var userPosition = null;
var currentEventID = "";

Number.prototype.toRadians = function() {
   return this * Math.PI / 180;
}


$(document).ready(function() {
	setListeners();

	var myFirebaseRef = new Firebase("https://connect-app.firebaseio.com/events");

	myFirebaseRef.on("value", function(snapshot) {
		myKeys = Object.keys(snapshot.val())
		//console.log(myKeys);
		var count = 0;
		snapshot.forEach(function(childSnapshot) {
			var businessEvent = childSnapshot.val();
			getBusinessReviews(businessEvent, myKeys[count]);
			count+=1;
		});
	});
});


function setListeners() {
	$("#logout").click(function() {
		window.localStorage.clear();
		window.location.href = "index.html";
	});

	$("#proximity").click(function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(pos) {
				userPosition = pos.coords;
				sortByProximity();
			});
		}
		else {
			console.log("no geolocation");
			return;
		}
		document.getElementById('recommended').innerHTML = '<img  class="icon" src="icon/thumbs-up.png"/>';
		document.getElementById('date').innerHTML = '<img class="icon" src="icon/calendar.png"/>';
		document.getElementById('proximity').innerHTML = '<img class="icon" src="icon/compass_b.png"/>';
		document.getElementById('popular').innerHTML = '<img class="icon" src="icon/fire.png"/>';
	});

	$("#recommended").click(function() {
		document.getElementById('recommended').innerHTML = '<img  class="icon" src="icon/thumbs-up_b.png"/>';
		document.getElementById('date').innerHTML = '<img class="icon" src="icon/calendar.png"/>';
		document.getElementById('proximity').innerHTML = '<img class="icon" src="icon/compass.png"/>';
		document.getElementById('popular').innerHTML = '<img class="icon" src="icon/fire.png"/>';
	});

	$("#date").click(function() {
		document.getElementById('recommended').innerHTML = '<img  class="icon" src="icon/thumbs-up.png"/>';
		document.getElementById('date').innerHTML = '<img class="icon" src="icon/calendar_b.png"/>';
		document.getElementById('proximity').innerHTML = '<img class="icon" src="icon/compass.png"/>';
		document.getElementById('popular').innerHTML = '<img class="icon" src="icon/fire.png"/>';
		sortByDate();
	});

	$("#popular").click(function() {
		document.getElementById('recommended').innerHTML = '<img  class="icon" src="icon/thumbs-up.png"/>';
		document.getElementById('date').innerHTML = '<img class="icon" src="icon/calendar.png"/>';
		document.getElementById('proximity').innerHTML = '<img class="icon" src="icon/compass.png"/>';
		document.getElementById('popular').innerHTML = '<img class="icon" src="icon/fire_b.png"/>';
		sortByPopularity();
	});

	$("#rsvpButton").click(function() {
		console.log("Current event Id is: "+ currentEventID);
		var info = 0;
		var myRef = new Firebase('https://connect-app.firebaseio.com/events/'+currentEventID+'/');
		myRef.on("value", function(snapshot) {
	        //console.log(snapshot.val());
	        info = snapshot.val().attendees + 1;
	    }, function (errorObject) {
	        console.log("The read failed inside explore list event click for rsvp: " + errorObject.code);
	    });

	    myRef.update({attendees: info});
	    window.location.href = "explore_list.html";
	});
}

function getBusinessReviews(businessEvent, eventUID) {

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
		myData = {d:data, b:eventUID, e:businessEvent.eventName, a:businessEvent.attendees, date:businessEvent.date}
		//console.log(myData);
	    addEvent(myData);
	    events.push(myData);
	    //console.log(events);

	    $('#load').remove();
	});
}

function addEvent(myData) {
	var business = myData.d;
	var eventName = myData.e;
	var eventUID = myData.b;

	var appendStr = '<li class="event" data-toggle="modal" data-target="#myModal" id="'+eventUID+'">\
	<p style="font-size:1.3em;">' + eventName + '</p><br>\
	<p>' + business.name + '</p>\
	<div class="myImageDiv"><img class="event_img" src="' + business.image_url +'" /></div>\
	<div class="event_info">'
	+ getRating(business) +
	'</div>\
	</li>';

	$('#events').append(appendStr);

	document.getElementById(eventUID).onclick = function(){
		console.log(eventUID + " clicked");
		var ref = new Firebase("https://connect-app.firebaseio.com/events/"+eventUID+"/");
	    ref.on("value", function(snapshot) {
	        info = snapshot.val();
	        //console.log(info);
	        currentEventID=eventUID;
	        document.getElementById("modal_header").innerHTML = '<h3 class="center">'+eventName+"</h3>";
	        document.getElementById("modal_body").innerHTML = '<h4 class="center">'+info.businessName+'</h4>'+
	        		'<h5 class="center">Date: '+info.date+'</h5>'+
	        		'<h5 class="center">Start: '+info.startTime+'&emsp; End: '+ info.endTime+'</h5>'+
	        		'<h5 class="center">'+info.address+'</h5>' +
	        		'<div class="center"><img src="' + business.image_url +'" height="100" width="100"/></div><hr>'+
	        		'<h4 class="center">'+info.description+'</h4>'+
	        		'<h4 class="center">'+info.description+'</h4>';

	    }, function (errorObject) {
	        console.log("The read failed inside explore list event click " + errorObject.code);
	    });
	}
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

function sortByDate(){
	console.log(events);
	events = events.sort(function(a1, b1) {
	    return  b1.date > a1.date;
	});
	console.log(events);
	$('#events').html(""); //Removes events

	for (var i = 0; i < events.length; i++) { //Adds events in order
		addEvent(events[i]);
		$('#load').remove();
	}
}

function sortByPopularity(){
	console.log(events);
	events = events.sort(function(a1, b1) {
	    return  parseInt(b1.a)-parseInt(a1.a);
	});
	console.log(events);
	$('#events').html(""); //Removes events

	for (var i = 0; i < events.length; i++) { //Adds events in order
		addEvent(events[i]);
		$('#load').remove();
	}
}



function sortByProximity() {
	if (!userPosition) {
		console.log("no user location defined");
		return;
	}

	$("#events").html("");

	$("body").append('<div id="load">\
            <img src="img/loader.gif" />\
        </div>');


	// heap sort
	// build a max heap first
	for (var i = 1; i < events.length; i++) {
		buildheap(i);
	}

	// we have our max heap, now lets move biggest elements to the back
	for (var wall = events.length - 1; wall > 0; wall--) {
		var tempEvent = events[0];
		events[0] = events[wall];
		events[wall] = tempEvent;
		heapify(wall - 1);
	}

	// now lets redisplay the events in the correct order
	for (var i = 0; i < events.length; i++) {
		//console.log(events[i]);
		//console.log(distance(events[i]));
		addEvent(events[i]);
		$('#load').remove();
	}

	function buildheap(index) {
		if (index == 0)
			return;

		var parent = Math.floor((i - 1) / 2);
		if (distance(events[index]) > distance(events[parent])) {
			var tempEvent = events[index];
			events[index] = events[parent];
			events[parent] = tempEvent;
			buildheap(parent);
		}
		else
			return;
	}

	function distance(event) {
		event = event.d;
		var lat1 = event.location.coordinate.latitude;
		var lon1 = event.location.coordinate.longitude;
		var lat2 = userPosition.latitude;
		var lon2 = userPosition.longitude;

		var R = 6371000; // meters
		var φ1 = lat1.toRadians();
		var φ2 = lat2.toRadians();
		var Δφ = (lat2-lat1).toRadians();
		var Δλ = (lon2-lon1).toRadians();

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		        Math.cos(φ1) * Math.cos(φ2) *
		        Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R * c;
		return d * 0.000621371;
	}

	function heapify(wall) {
		var element = 0;
		var leftChild = (2 * element) + 1;
		var rightChild = (2 * element) + 2;
		while (leftChild <= wall) {
			if (rightChild > wall) {
				if (distance(events[leftChild]) > distance(events[element])) {
					var tempEvent = events[leftChild];
					events[leftChild] = events[element];
					events[element] = tempEvent;
				}
				return;
			}
			else if (distance(events[element]) > distance(events[leftChild]) &&
				distance(events[element]) > distance(events[rightChild])) {
				return;
			}

			else {
				if (distance(events[rightChild]) > distance(events[leftChild])) {
					var tempEvent = events[rightChild];
					events[rightChild] = events[element];
					events[element] = tempEvent;

					element = rightChild;
					leftChild = (2 * element) + 1;
					rightChild = (2 * element) + 2;	

				}
				else {
					var tempEvent = events[leftChild];
					events[leftChild] = events[element];
					events[element] = tempEvent;

					element = leftChild;
					leftChild = (2 * element) + 1;
					rightChild = (2 * element) + 2;	
				}
			}
		}
	}
}
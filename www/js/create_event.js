/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var category = "other";

document.getElementById("button_food").onclick = function () {
    category = "food";
    document.getElementById("button_food").style.color="#ff9999";
    document.getElementById("button_food").style.border="2px solid #ff9999";
    document.getElementById("button_fun").style.color="white";
    document.getElementById("button_fun").style.border="2px solid white";
    document.getElementById("button_health").style.color="white";
    document.getElementById("button_health").style.border="2px solid white";
    document.getElementById("button_other").style.color="white";
    document.getElementById("button_other").style.border="2px solid white";
};

document.getElementById("button_fun").onclick = function () {
    category = "fun";
    document.getElementById("button_food").style.color="white";
    document.getElementById("button_food").style.border="2px solid white";
    document.getElementById("button_fun").style.color="#ccff33";
    document.getElementById("button_fun").style.border="2px solid #ccff33";
    document.getElementById("button_health").style.color="white";
    document.getElementById("button_health").style.border="2px solid white";
    document.getElementById("button_other").style.color="white";
    document.getElementById("button_other").style.border="2px solid white";
};

document.getElementById("button_health").onclick = function () {
    category = "health";
    document.getElementById("button_food").style.color="white";
    document.getElementById("button_food").style.border="2px solid white";
    document.getElementById("button_fun").style.color="white";
    document.getElementById("button_fun").style.border="2px solid white";
    document.getElementById("button_health").style.color="#ccffff";
    document.getElementById("button_health").style.border="2px solid #ccffff";
    document.getElementById("button_other").style.color="white";
    document.getElementById("button_other").style.border="2px solid white";
};

document.getElementById("button_other").onclick = function () {
    category = "other";
    document.getElementById("button_food").style.color="white";
    document.getElementById("button_food").style.border="2px solid white";
    document.getElementById("button_fun").style.color="white";
    document.getElementById("button_fun").style.border="2px solid white";
    document.getElementById("button_health").style.color="white";
    document.getElementById("button_health").style.border="2px solid white";
    document.getElementById("button_other").style.color="#ffff00";
    document.getElementById("button_other").style.border="2px solid #ffff00";
};


document.getElementById("button_create_event").onclick = function () {
    var eventName = document.getElementById('inputEventName').value;
    var date = document.getElementById('inputDate').value;
    var startTime = document.getElementById('inputStartTime').value;
    var endTime = document.getElementById('inputEndTime').value;
    var description = document.getElementById('inputDescription').value;
    var hashtag = document.getElementById('inputHashtag').value;
    console.log(eventName, date, startTime, endTime, description, hashtag, category);

    if(eventName=="" || date=="" || startTime=="" || endTime=="" || description=="" || hashtag=="" || category==""){
        alert("Please fill in all fields.");
        location.href = "create_event.html";
    }

    var myUserID = window.localStorage.getItem("userUID");
    if(myUserID==null){
        alert("Null UserID found.");
        location.href = "create_event.html";
    }

    var ref = new Firebase("https://connect-app.firebaseio.com/users/"+myUserID+"/");

    var myBusinessName = "";
    var myBusinessID = "";
    var myAddress = "";

    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        console.log("ID: "+ snapshot.val().business.yelpID);
        console.log("address: "+snapshot.val().business.address);

        myBusinessName = snapshot.val().business.name;
        myBusinessID = snapshot.val().business.yelpID;
        myAddress = snapshot.val().business.address;

        if(snapshot.val().business.name === ""){
            console.log("Not a Business");
            location.href = "explore_list_business.html";
        }
        else{
            console.log("A Business");
            var eventRef = new Firebase("https://connect-app.firebaseio.com/events/");
            eventRef.push({
                businessName:myBusinessName,
                address:myAddress,
                businessID:myBusinessID,
                userID: myUserID,
                eventName:eventName,
                date:date,
                startTime:startTime,
                endTime:endTime,
                description:description,
                hashtag:hashtag,
                category:category,
                attendees:0
            });
            location.href = "explore_list_business.html";
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        location.href = "explore_list_business.html";
    });
    
};

document.getElementById("button_back").onclick = function () {
    location.href = "explore_list_business.html";
};



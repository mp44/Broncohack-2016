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

var isBusiness = false;

document.getElementById("button_business").onclick = function () {
    isBusiness = true;
    document.getElementById("button_business").style.backgroundColor = "green";
    document.getElementById("button_user").style.backgroundColor = "gray";
    document.getElementById("create_account_form").innerHTML = '<form><div class="form-group row"><label for="inputName" class="col-xs-3 form-control-label">Business Name</label><div class="col-xs-9"><input type="text" class="form-control" id="inputName" placeholder="Business Name"></div></div><div class="form-group row"><label for="inputAddress" class="col-xs-12 form-control-label">Business Address</label><div class="col-xs-12"><input type="text" class="form-control" id="inputAddress" placeholder="Business Address"></div></div><div class="form-group row"><div class="col-xs-5"><input type="text" class="form-control" id="inputCity" pattern="[a-z|A-Z| ]*" placeholder="City"></div><div class="col-xs-4"><input type="text" class="form-control" id="inputState" pattern="[a-z|A-Z| ]*" placeholder="State"></div><div class="col-xs-3"><input type="text" class="form-control" id="inputZip" pattern="[0-9]{5}" placeholder="Zip"></div></div><br><div class="form-group row"><label for="inputEmail" class="col-xs-3 form-control-label">Email</label><div class="col-xs-9"><input type="email" class="form-control" id="inputEmail"  placeholder="Email"></div></div><div class="form-group row"><label for="inputPassword" class="col-xs-3 form-control-label">Password</label><div class="col-xs-9"><input type="password" class="form-control" id="inputPassword" placeholder="Password"></div></div></form>';
};

document.getElementById("button_user").onclick = function () {
    isBusiness=false;
    document.getElementById("button_business").style.backgroundColor = "gray";
    document.getElementById("button_user").style.backgroundColor = "green";
    document.getElementById("create_account_form").innerHTML = '<form><div class="form-group row"><label for="inputFirstName" class="col-xs-2 form-control-label">First Name</label><div class="col-xs-4"><input type="text" class="form-control" id="inputFirstName" pattern="[A-Z][a-z|A-Z]*" placeholder="First Name"></div><label for="inputLastName" class="col-xs-2 form-control-label">Last Name</label><div class="col-xs-4"><input type="text" class="form-control" id="inputLastName" pattern="[A-Z][a-z|A-Z]*" placeholder="Last Name"></div></div><div class="form-group row"><label for="inputEmail" class="col-xs-3 form-control-label">Email</label><div class="col-xs-9"><input type="email" class="form-control" id="inputEmail" placeholder="Email"></div></div><div class="form-group row"><label for="inputPassword" class="col-xs-3 form-control-label">Password</label><div class="col-xs-9"><input type="password" class="form-control" id="inputPassword" placeholder="Password"></div></div></form>';
};

document.getElementById("button_back").onclick = function () {
    location.href = "index.html";
};

document.getElementById("button_create_account").onclick = function () {
    if(isBusiness == false){
        var firstName = document.getElementById('inputFirstName').value;
        var lastName = document.getElementById('inputLastName').value;
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;
        console.log(firstName, lastName, email, password);
        attemptCreateUserAccount(firstName, lastName, email, password);
    }
    else{
        var businessName = document.getElementById('inputName').value;
        var businessAddress = document.getElementById('inputAddress').value;
        var businessCity = document.getElementById('inputCity').value;
        var businessState = document.getElementById('inputState').value;
        var businessZip = document.getElementById('inputZip').value;
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;

        businessAddress = businessAddress+", "+businessCity+", "+businessState+", "+businessZip;

        attemptCreateBusinessAccount(businessName, businessAddress, email, password);
    }

};


function attemptCreateUserAccount(userFirstName, userLastName, userEmail, userPassword){
    var firebaseReference = new Firebase('https://connect-app.firebaseio.com/users/');
    firebaseReference.createUser({
        email: userEmail,
        password: userPassword
    }, function(error, userData) {
        if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                break;
              case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                break;
              default:
                console.log("Error creating user:", error);
            }
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            window.localStorage.setItem("userUID", userData.uid);
            window.localStorage.setItem("isBusiness", "no");

            var usersRef = new Firebase("https://connect-app.firebaseio.com/users/"+userData.uid+"/");
            usersRef.set({
              name: {
                firstName: userFirstName,
                lastName: userLastName
              },
              business: {
                name: "",
                address: ""
              }
            });

            location.href = "sample_explore.html";
        }
    });
}

function attemptCreateBusinessAccount(businessName, businessAddress, businessEmail, businessPassword){
    var firebaseReference = new Firebase('https://connect-app.firebaseio.com/users/');
    firebaseReference.createUser({
        email: businessEmail,
        password: businessPassword
    }, function(error, userData) {
        if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                break;
              case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                break;
              default:
                console.log("Error creating user:", error);
            }
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            window.localStorage.setItem("userUID", userData.uid);

            var usersRef = new Firebase("https://connect-app.firebaseio.com/users/"+userData.uid+"/");
            usersRef.set({
              name: {
                firstName: "",
                lastName: ""
              },
              business: {
                name: businessName,
                address: businessAddress
              }
            });


            /* CREATES TEST EVENT! */
            var ref = new Firebase("https://connect-app.firebaseio.com/events/");
            ref.push({
              eventName:"Buffet Food!",
              businessName:"Bombay Gardens",
              businessID:"san-jose-tofu-company-san-jose",
              userID: userData.uid,
              address: "540 Newhall Dr #10, San Jose, CA 95110",
              date:"02/02/16",
              startTime:"1:00PM",
              endTime:"2:00PM",
              description:"Eat my buffet!"
            });

            location.href = "sample_explore.html";
        }
    });
}


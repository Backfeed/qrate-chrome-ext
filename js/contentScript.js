(function() {

	console.log('CONTENT SCRIPT STARTS!');

  AWS.config.region = 'us-east-1';

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b10673e0-1654-4519-9938-2d624de0532a'
  });
  
  var lambda = new AWS.Lambda();

	$(document).on('click', '#QR-bubble-menu-item-qrate-link', qrateLink);
	
	$(document).on('click', '#QR-bubble-menu-item-send-link', sendLink);
	
  $(document).on('click', '#QR-bubble-menu-item-inbox', inboxLink);

  $(document).on('click', '#QR-signup-button', signup);

	$(document).on('click', '#QR-login-button', login);

  init();

  function init() {
    chrome.storage.sync.get('QR-currentUser', function(CurrentUser) {

      console.log("CurrentUser", CurrentUser);

      if (CurrentUser && CurrentUser.passHash) {
        console.log("user detected");
        appendBubble();
      } else {
        console.log("guest detected");
        appendGuestBubble();
      }

    });
  }

	function appendBubble() {
    var url = chrome.extension.getURL('html/bubble.html');
    $.get(url, appendToBody);
  }

  function appendGuestBubble() {
		var url = chrome.extension.getURL('html/guestBubble.html');
    $.get(url, appendToBody);
	}

  function signup() {

    var email =  $('#QR-auth-email').val();
    var password =  $('#QR-auth-password').val();

    var signupInput = {
      email:  email,
      password:  password
    };

    console.log("signup: ", "email", email, "password", password);

    lambda.invoke({
      FunctionName: 'qratebackend-signup',
      Payload: JSON.stringify(signupInput)
    }, function(err, data) {
      if (err) {
        console.log("CB: signup: err", err);
      } else {
        var output = JSON.parse(data.Payload);
        console.log("CB: signup: data", output);
      }
    });

  }

  function login() {

    var email =  $('#QR-auth-email').val();
    var password =  $('#QR-auth-password').val();

    var loginInput = {
      email:  $('#QR-auth-email').val(),
      password:  $('#QR-auth-password').val()
    };

    console.log("login: ", "email", email, "password", password);

    lambda.invoke({
      FunctionName: 'qratebackend-login',
      Payload: JSON.stringify(loginInput)
    }, function(err, data) {
      if (err) {
        console.log("CB: login: err", err);
      } else {
        var output = JSON.parse(data.Payload);
        console.log("CB: login: output", output);
      }
    });

  }

  function qrateLink(e) {
    console.log(document.location.href);
  }

  function sendLink(e) {
  	var url = chrome.extension.getURL('html/sendLink.html');
    $.get(url, appendToContainer);
  }

  function inboxLink(e) {
    console.log('inbox clicked!');
  }

	function appendToBody(html) {
  	$('body').append(html);
  }

  function appendToContainer(html) {
  	$('#QR-container').append(html);
  }

}());
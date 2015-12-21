(function() {

	console.log('CONTENT SCRIPT STARTS!');

	$(document).on('click', '#QR-bubble-menu-item-qrate-link', qrateLink);
	
	$(document).on('click', '#QR-bubble-menu-item-send-link', sendLink);
	
	$(document).on('click', '#QR-bubble-menu-item-inbox', inboxLink);

	appendBubble();

  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:43163e60-6220-4872-935c-3c2457fe4ef8',
  });

  // Initialize the Cognito Sync client

  AWS.config.credentials.get(function(){

     var syncClient = new AWS.CognitoSyncManager();

     syncClient.openOrCreateDataset('myDataset', function(err, dataset) {

        dataset.put('myKey', 'myValue', function(err, record){

           dataset.synchronize({

              onSuccess: function(data, newRecords) {
                console.log("data", data, "newRecords", newRecords);
                  // Your handler code here
              }

           });

        });
       
     });

  });

	function appendBubble() {
		var url = chrome.extension.getURL('html/bubble.html');
    $.get(url, appendToBody);
	}

  function qrateLink(e) {
    console.log(document.location.href);
  }

  function sendLink(e) {
  	var url = chrome.extension.getURL('html/sendLink.html');
    $.get(url, appendToContainer);
  }

  function inboxLink(e) {
  	
  }

	function appendToBody(html) {
  	$('body').append(html);
  }

  function appendToContainer(html) {
  	$('#QR-container').append(html);
  }

}());
(function() {

  console.log('CONTENT SCRIPT STARTS!');

  AWS.config.region = 'us-east-1';

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b10673e0-1654-4519-9938-2d624de0532a'
  });

  let init = () => {
    $('<link id="floating-button-import" rel="import" href="' + chrome.extension.getURL("components/floatingButton/floatingButton.html") + '" />').appendTo(document.head);

    $('<qrate-floating-button />').appendTo(document.body);
  };

  init();

}());
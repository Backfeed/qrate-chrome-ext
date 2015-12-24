(function() {

  console.log('CONTENT SCRIPT STARTS!');

  AWS.config.region = 'us-east-1';

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b10673e0-1654-4519-9938-2d624de0532a'
  });

  let init = () => {
    $('<qrate-floating-button />').appendTo(document.body);
  }

  init();

}());
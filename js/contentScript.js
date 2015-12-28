AWS.config.region = 'us-east-1';

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b10673e0-1654-4519-9938-2d624de0532a'
});

let lambda = new AWS.Lambda();

{
    console.log('CONTENT SCRIPT STARTS!');

    let floatingButton = null;

    function init() {
        $.get(chrome.extension.getURL('components/floatingButton/floatingButton.html'), (data) => {
            floatingButton = $($.parseHTML(data)).appendTo('body');
            initFloatingButton();
        });
    }

    function initFloatingButton() {
        if (floatingButton) {

            floatingButton.on('click', '.bubble', togglePopup);
            floatingButton.on('click', '#QRATE-signup-button', signup);
            floatingButton.on('click', '#QRATE-login-button', login);
            floatingButton.on('click', '#QRATE-bubble-menu-item-qrate-link', qrateLink);

            chrome.storage.sync.get('QR-currentUser', function (CurrentUser) {

                console.log("CurrentUser", CurrentUser);
                if (CurrentUser && CurrentUser.passHash) {
                    console.log("user detected");
                    floatingButton.find('.is--guest').hide();
                } else {
                    console.log("guest detected");
                    floatingButton.find('.is--logged-in').hide();
                }

            });

        }
    }

    function togglePopup(e) {
        chrome.storage.sync.get('QR-currentUser', function (CurrentUser) {

            console.log("CurrentUser", CurrentUser);

            if (CurrentUser && CurrentUser.passHash) {
                console.log("user detected");
                floatingButton.find('.popup.is--guest').toggle();
            } else {
                console.log("guest detected");
                floatingButton.find('.popup.is--logged-in').toggle();
            }

        });
    }

    function signup() {
        let email = floatingButton.find('#QRATE-auth-email').val();
        let password = floatingButton.find('#QRATE-auth-password').val();

        let signupInput = {
            email: email,
            password: password
        };

        console.log("signup: ", "email", email, "password", password);

        lambda.invoke({
            FunctionName: 'qratebackend-signup',
            Payload: JSON.stringify(signupInput)
        }, function (err, data) {
            if (err) {
                console.log("CB: signup: err", err);
            } else {
                let output = JSON.parse(data.Payload);
                console.log("CB: signup: data", output);
            }
        });
    }

    function login() {
        let email = floatingButton.find('#QRATE-auth-email').val();
        let password = floatingButton.find('#QRATE-auth-password').val();

        let loginInput = {
            email: email,
            password: password
        };

        console.log("login: ", "email", email, "password", password);

        lambda.invoke({
            FunctionName: 'qratebackend-login',
            Payload: JSON.stringify(loginInput)
        }, function (err, data) {
            if (err) {
                console.log("CB: login: err", err);
            } else {
                let currentUser = JSON.parse(data.Payload);
                console.log("CB: login: currentUser", currentUser);
                saveCurrentUserToLocalStorage(currentUser);
            }
        });
    }

    function qrateLink(e) {
        let tag = prompt('tag your link');

        chrome.storage.sync.get('QR-currentUser', function (data) {
            let currentUser = data['QR-currentUser'];
            let input = {
                tag: tag,
                url: document.location.href,
                submitterId: currentUser.uuid
            };
            lambda.invoke({
                FunctionName: 'qratebackend-createlink',
                Payload: JSON.stringify(input)
            }, function (err, data) {
                if (err) {
                    console.log("CB: submit link: err", err);
                } else {
                    let data = JSON.parse(data.Payload);
                    console.log("CB: submit link", data);
                }
            });
        });

    }

    init();

    function saveCurrentUserToLocalStorage(currentUser) {
        chrome.storage.sync.set({'QR-currentUser': currentUser});
    }
}
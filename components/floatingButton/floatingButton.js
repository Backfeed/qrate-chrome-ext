(function() {
    let lambda = new AWS.Lambda();

    class FloatingButton extends HTMLElement {

        // Fires when an instance of the element is created.
        createdCallback() {
            var link = document.getElementById('floating-button-import');
            link.addEventListener('load', function(e) {
                var importedDoc = link.import;
                var template = importedDoc.getElementById('floating-button-template');
                var clone = document.importNode(template.content, true);
                shadow.appendChild(clone);
            });
        };

        // Fires when an instance was inserted into the document.
        attachedCallback() {
            let shadowRoot = $(this.shadowRoot);
            shadowRoot.on('click', '.QR-bubble', this.togglePopup);
            shadowRoot.find('#QR-signup-button').on('click', this.signup);
            shadowRoot.find('#QR-login-button').on('click', this.login);
            shadowRoot.find('#QR-bubble-menu-item-qrate-link').on('click', this.qrateLink);
        };

        // Fires when an attribute was added, removed, or updated.
        attributeChangedCallback(attrName, oldVal, newVal) {
            //switch (attrName) {}
        };

        togglePopup(e) {
            let $this = $(this);

            chrome.storage.sync.get('QR-currentUser', function(CurrentUser) {

                console.log("CurrentUser", CurrentUser);

                if (CurrentUser && CurrentUser.passHash) {
                    console.log("user detected");
                    $this.parent().find('.QR-bubble-menu').toggle();
                } else {
                    console.log("guest detected");
                    $this.parent().find('.QR-bubble-auth-container').toggle();
                }

            });
        };

        qrateLink(e) {
            console.log(document.location.href);
        }

        signup(e) {

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
                    console.log("CB: signup: data", data);
                }
            });

        }

        login(e) {

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
                    console.log("CB: login: data", data);
                }
            });

        }
    }

    document.registerElement('qrate-floating-button', FloatingButton);
})();
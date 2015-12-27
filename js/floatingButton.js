(function() {
    let template = `
        <style>
            @import url(https://fonts.googleapis.com/css?family=Lato:400,300,700);

            .QR-container {
            font-family: 'Lato', sans-serif;
              cursor: pointer;
              position: fixed;
              bottom: 50px;
              right: 20px;
              z-index: 1;
            }

            .QR-container:hover .QR-bubble-label {
              display: block;
            }

            .QR-bubble {
              position: relative;
              height: 50px;
              width: 50px;
              border-radius: 50%;
              text-align: center;
              box-shadow: 0 -1px 1px 0 rgba(255,255,255,0.75) inset, 0 2px 4px 0 rgba(99, 99, 99, 0.57);
              border: 0;
              background-color: #4285f8;
            }

            .QR-bubble-menu {
              display: none;
            }

            .QR-bubble-label {
              display: none;
              border: 2px solid rgba(66, 133, 248, 0.7);
              background-color: white;
              position: absolute;
              width: 160px;
              right: 50%;
              top: 10px;
              color: #8ab0f1;
              font-size: 13px;
              height: 30px;
              line-height: 27px;
              border-radius: 15px;
              padding-right: 25px;
              z-index: -1;
            }

            .QR-bubble-auth-container {
              display: none;
              position: absolute;
              bottom: 55px;
              right: 0;
              background-color: #4285f8;
              border: 1px solid #000;
              padding: 20px;
            }

            .QR-bubble-menu-item {
              text-align: center;
              float: right;
              height: 50px;
              min-width: 50px;
              border-radius: 50%;
              border: 1px solid #eee;
              background: red;
            }
        </style>

        <div id="QR-guest-container" class="QR-container">

            <div class="QR-bubble">
                <span class="icon icon-add-link">
                  <svg width="22" height="26">
                      <image width="22" height="26" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAMAAACEqFxyAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAY1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAACa+yuyAAAAH3RSTlMAPu5GQjM9cxGIaATzkqp3uwUBSnJN3P65Vd3MZiKZ+nLpmwAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACkSURBVCjPjZDbDoMgEERXBIVqkd4r2M7//2WhplRlm3Qf2ORkMsws0WoqISoqpwZqBktAMlgBaoMaKWULtHE1b6DNriPqkadP1AD7EltgKE0GCFV+qcWs3QSMYq6Og+PKCxim1n/40B2J8T6dL8Qkud7uVOYegZGy/NNSe4QssRCzfvLwj69hvCCsecY3LGi6d0jndCsxLex4/kOvA4LmuDFT2i866w4r6blwbAAAAABJRU5ErkJggg=="/>
                  </svg>
                </span>
                <div class="QR-bubble-label">Log in first to enjoy Qrate</div>
            </div>

            <div class="QR-bubble-auth-container">
                <div class="QR-input-container">
                    <input type="email" id="QR-auth-email" placeholder="Email">
                </div>
                <div class="QR-input-container">
                    <input type="password" id="QR-auth-password" placeholder="password">
                </div>
                <button id="QR-signup-button">Signup</button>
                <button id="QR-login-button">Login</button>
            </div>

            <div class="QR-bubble-menu">
                <div class="QR-bubble-menu-item">
                    <a id="QR-bubble-menu-item-qrate-link">Qrate it</a>
                </div>
            </div>

        </div>
    `;

    let lambda = new AWS.Lambda();

    class FloatingButton extends HTMLElement {

        // Fires when an instance of the element is created.
        createdCallback() {
            this.createShadowRoot().innerHTML = template ;
        };

        // Fires when an instance was inserted into the document.
        attachedCallback() {
            let shadowRoot = $(this.shadowRoot);
            this.bubble = shadowRoot.find('.QR-bubble');
            this.bubble.on('click', this.togglePopup);
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
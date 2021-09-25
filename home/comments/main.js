const template = document.getElementById("checkElement");   
let check = document.importNode(template.content, true).children[0];
let checkBox = document.getElementById("checkbox-id-0"),
    proceed = document.getElementById("proceed"),
    message = document.getElementById("invalid");
checkBox.click = null;
proceed.disabled = true;
let disagreed = () => {
    if (!checkBox.firstChild) {
        message.className = message.className.removeClass("invisible");
    } else {
        message.className += " invisible" 
        if (window.location.hash == "#89679456935") {
            
        }
        window.location.hash = "#89679456935"  
    }
};
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    document.getElementsByClassName("pfp_img")[0].src = profile.getImageUrl();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
  }

window.addEventListener("load", () => {
    auth2.attachClickHandler(proceed, {},
        function(googleUser) {
        document.getElementById('pfp_img_id').src = googleUser.getBasicProfile().getImageUrl();
        }, function(error) {
        console.error('An error occured:', JSON.stringify(error, undefined, 2));
    });
})

checkBox.addEventListener("click", () => {
    if (!checkBox.firstChild) {
        checkBox.appendChild(check)
        checkBox.setAttribute("data-checked", "true")
        proceed.disabled = false;
    } else {
        proceed.disabled = true;
        checkBox.removeChild(check)
        checkBox.setAttribute("data-checked", "false")
    }
})
String.prototype.removeClass = function(className) {
    return this.replace(className, '');
}

var googleUser = {};
  var startApp = function() {
    gapi.load('auth2', function(){
      auth2 = gapi.auth2.init({
        client_id: '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
    });
  };

  function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          document.getElementById('name').innerText = "Signed in: " +
              googleUser.getBasicProfile().getName();
        }, function(error) {
          console.error('An error occured:', JSON.stringify(error, undefined, 2));
    });
  }

  startApp()

proceed.addEventListener("click", disagreed)
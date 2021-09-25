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
var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function(){
    auth2 = gapi.auth2.init({
      client_id: '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin'
    });
  });
};

startApp()

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile(),
        id = profile.getId(), 
        image_url = profile.getImageUrl(),
        name = profile.getName(),
        email = profile.getEmail();
      
    let pfp_elem = document.getElementsByClassName("pfp_img")[0];

    pfp_elem.setAttribute("src", image_url)
    
    console.log('ID: ' + id);
    console.log('Name: ' + name);
    console.log('Image URL: ' + image_url);
    console.log('Email: ' + email);

    localStorage.setItem("pfp_url", image_url)
    localStorage.setItem("pf_id", id.toString())
    localStorage.setItem("pf_name", name)
    localStorage.setItem("pf_email", email);
}
if (!auth2.isSignedIn.get()) {
  let pfp_img_elem = document.getElementsByClassName("pfp_img")[0],
      image_url = localStorage.getItem("pfp_url");

  pfp_img_elem.setAttribute("src", image_url);
  
}
window.addEventListener("load", () => {
     auth2.attachClickHandler(proceed, {},
        onSignIn, function(error) {
        console.error('An error occured:', JSON.stringify(error, undefined, 2));
    });
})

checkBox.addEventListener("click", () => {
    if (!checkBox.firstChild) {
        message.className += " invisible"
        checkBox.appendChild(check)
        checkBox.setAttribute("data-checked", "true")
        proceed.disabled = false;
    } else {
        message.className = message.className.removeClass("invisible");
        proceed.disabled = true;
        checkBox.removeChild(check)
        checkBox.setAttribute("data-checked", "false")
    }
})
String.prototype.removeClass = function(className) {
    return this.replace(className, '');
}


proceed.addEventListener("click", disagreed)
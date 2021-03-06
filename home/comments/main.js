const template = document.getElementById("checkElement");   
let firestore;
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
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

async function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile(),
        id = profile.getId(), 
        image_url = profile.getImageUrl(),
        name = profile.getName(),
        email = profile.getEmail();

    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    let date_joined;
    let now = new Date();
    date_joined = {date_joined: now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear()};
    let alreadyExists = await firestore.collection("profiles").doc(id).get().then(ca => ca.exists);
    if (!alreadyExists) {
      firestore.collection("profiles").doc(id).set({banned: false, friends: [], pending_friend_requests: [], id: id, name: name, image_url: image_url, description: null, date_joined: date_joined["date_joined"]}).then(() => {
        window.location.href = "https://blueprogrammer212.github.io/home/comments/page"
      });
    } else {
      window.location.href="https://blueprogrammer212.github.io/home/comments/page"
    }
      
    let pfp_elem = document.getElementsByClassName("pfp_img")[0];

    pfp_elem.setAttribute("src", image_url)
    
    console.log('ID: ' + id);
    console.log('Name: ' + name);
    console.log('Image URL: ' + image_url);
    console.log('Email: ' + email);

    setCookie("pfp_url", image_url, 365)
    setCookie("pf_id", id.toString(), 365)
    setCookie("pf_name", name, 365)
    setCookie("pf_email", email, 365);
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let pfp_img_elem = document.getElementsByClassName("pfp_img")[0];

class Profile {
  constructor(url, id, name) {
      this.url = url;
      this.id = id; 
      this.name = name;
  }
}

function loadInformation() {
  return new Promise((res) => {
    if (auth2.isSignedIn.get()) {
      let image_url = getCookie("pfp_url"), 
          name = getCookie("pf_name"),
          id = getCookie("pf_id");
      console.log(`Successfully loaded client content... ${document.body}`)
      setTimeout(res, 2000, new Profile(image_url, id, name))
    }
  });
}
function deleteCookie( name, path, domain ) {
  if(getCookie(name)) {
    document.cookie = name + "=" +
      ((path) ? ";path="+path:"")+
      ((domain)?";domain="+domain:"") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('Clearing cookies...');
    console.log(`Signing out... ${googleUser}`);
    let domain = "https://blueprogrammer212.github.io";
    deleteCookie("pfp_url", "/", domain)
    deleteCookie("pf_id", "/", domain)
    deleteCookie("pf_name", "/", domain)
    deleteCookie("pf_email", "/", domain);
  });
}

console.log("%cWarning", "color:red;font-size:32px;");
console.log("%cPlease do not execute a malicious code here! You might give hackers access to your account!", "color:white;font-size:16px;");
console.log("%cSelf-XSS is a software attack to give hackers access to your account by convincing you to execute a malicious code into the developer console", "color:blue;font-size:16px");
console.log("%cLearn more at https://blueprogrammer212.github.io/self-xss", "color:blue;font-size:16px");

window.addEventListener("keypress", (e) => {
    e.preventDefault();
})

const firebaseConfig = {
  apiKey: "AIzaSyDqcXlXth2r-3nA-nWxUTlcm5-vgq2ZQgA",
  authDomain: "pixcel-272e8.firebaseapp.com",
  projectId: "pixcel-272e8",
  storageBucket: "pixcel-272e8.appspot.com",
  messagingSenderId: "527485563587",
  appId: "1:527485563587:web:59c6c095e772a028802876",
  measurementId: "G-49V48L8TZR",
  databaseURL: "https://pixcel-272e8-default-rtdb.firebaseio.com"
};


window.addEventListener("load", () => {
    setTimeout(() => {
      firebase.initializeApp(firebaseConfig);
      firestore = firebase.firestore();
      if (auth2.isSignedIn.get()) {
        let image_url = getCookie("pfp_url"), 
        name = getCookie("pf_name"),
        id = getCookie("pf_id");
        firestore.collection("profiles").doc(id).update({id: id, name: name, image_url: image_url, description: null}).then(() => {
          window.location.href="https://blueprogrammer212.github.io/home/comments/page"
        })
        console.log(`Loading profile... ${new Profile(image_url, id, name)}`)
        console.log(`Loading username... NAME:${name}`)
        console.log(`Loading UserID... ID:<${id}>`)
        console.log(`Loading profile picture ${image_url}...`)  
        firestore.collection("profiles").doc(getCookie("pf_id")).get().then(pfp_info => {
          pfp_img_elem.setAttribute("src", pfp_info.data().image_url);
        }).catch(e => console.error(`Something unexpected occured. ${e}`));
      } else {
        document.body.style = ""
      }
    }, 2000);
    auth2.attachClickHandler(proceed, {}, onSignIn, function(error) {
      console.error('An error occured:', JSON.stringify(error, undefined, 2));
      document.getElementById("invalid").innerHTML = "Sign in failed. Try Again";
      document.getElementById("invalid").className = document.getElementById("invalid").className.removeClass("invisible");
    });
    console.log(`Loading client content... ${document.body}`)
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
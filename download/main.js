const regExpression = /|([^|]*)|/g
/*
if (window.location.host !== "blueprogrammer212.github.io") {
  window.location.href = "https://blueprogrammer212.github.io/home"
}
*/

console.log("Initializing download scontent...")

if ("getElementsByTagName" in document) {
  let images = document.getElementsByTagName("img");
  for (let i = 0; i < images.length; ++i) {
      images[i].addEventListener("contextmenu", () => {
          return false;
      });
      images[i].setAttribute("draggable", "false");
      //Emoji size
      if (images[i].classList.contains("emoji")) {
          images[i].width = "20"
          images[i].height = "20"
      }
  }
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
          }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
      }
  }
}

function hashChangeCallback() {
    if (window.location.hash == "#856764344573547") {
        window.location.href = "./comments"
    } else if (window.location.hash == "#help") {
        window.location.href = "blueprogrammer213.github.io/help"
    } else if (window.location.hash == "#community") {
        window.location.href = "./community?r=as";
    }
}

hashChangeCallback()

window.addEventListener("hashchange", hashChangeCallback)

for (let i = 0; i < document.images.length; ++i) {
    document.images[i].oncontextmenu = function() {
        return false;
    }
}

document.body.oncontextmenu = function() {
    return false; 
}

class FragmentManager {
    constructor(template) {
        this.template = template;
    }
    appendTo(element) {
        this.emoji = document.importNode(this.template.content, true).children[0];
        element.appendChild(this.emoji)
    }
}

let template = document.getElementById("emoji_heart");
let fragment = new FragmentManager(template);
/*
for (let i = 0; i < 3; ++i) {
    fragment.appendTo(document.getElementById("p-id-1"))
}
*/
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

class DownloadPostManager {
      constructor(parent_id, template_id) {
         this.parent_element = document.getElementById(parent_id);
         this.template = document.getElementById(template_id);
         this.map = new Map();
      }
      setTitle(element, name = "Pixcel", child_index = 0) {
          if (element.children[child_index]) {
              element.children[child_index].innerHTML = name;
          }
      }
      setDownloadLink(element, src) {
         if (src === void 0) return;
         if ("setAttribute" in Element.prototype) {
           element.setAttribute("href", src);
         }
      }
      add(data, doc) {
        const clone = document.importNode(this.template.content, true).children[0];
        this.map.set(doc, clone);
        this.setTitle(clone, data.name, 0);
        this.setTitle(clone, data.version, 1);
        this.setTitle(clone, data.description, 2);
        this.setDownloadLink(clone.children[3], data.downloadLink);
        document.getElementById("noPosts").classList.toggle("invisible", true)
        this.parent_element.appendChild(clone);
      }
      remove(doc) {
        this.parent_element.removeChild(this.map.get(doc));
        this.map.delete(doc);
      }
      edit(data, doc) {
        const clone = this.map.get(doc);
        this.setTitle(clone, data.name, 0);
        this.setTitle(clone, data.version, 1);
        this.setTitle(clone, data.description, 2);
        this.setDownloadLink(clone.children[3], data.downloadLink);
        document.getElementById("noPosts").classList.toggle("invisible", true)
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

let downloadManager = new DownloadPostManager("download_releases_posts", "download_post_template");

window.addEventListener("load", () => {
    setTimeout(() => { 
      if (auth2.isSignedIn.get()) {
        firebase.initializeApp(firebaseConfig);
        let firestore = firebase.firestore();
        firestore.collection("download_releases").onSnapshot(snapshot => {
           snapshot.docChanges().forEach(querySnapshots => {
             if (querySnapshots.type === "added") {
                  downloadManager.add(querySnapshots.doc.data(), querySnapshots.doc.id);
             }
             if (querySnapshots.type === "removed") {
                downloadManager.remove(querySnapshots.doc.id);
             }
             if (querySnapshots.type === "modified") {
               downloadManager.edit(querySnapshots.doc.data(), querySnapshots.doc.id);
             }
           })
        })
        let image_url = getCookie("pfp_url"), 
        name = getCookie("pf_name"),
        id = getCookie("pf_id");
        console.log(`Loading profile... ${new Profile(image_url, id, name)}`)
        console.log(`Loading username... NAME:${name}`)
        console.log(`Loading UserID... ID:<${id}>`)
        console.log(`Loading profile picture ${image_url}...`)  
        pfp_img_elem.setAttribute("src", image_url);
      }
      document.body.style = "";
    }, 2000)
    console.log(`Loading client content... ${document.body}`)
})
console.log("%cWanna be a developer?", "font-size: 15px;")
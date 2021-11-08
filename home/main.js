const regExpression = /|([^|]*)|/g
/*
if (window.location.host !== "blueprogrammer212.github.io") {
  window.location.href = "https://blueprogrammer212.github.io/home"
}
*/

/*
BSD 3-Clause License

Copyright (c) 2021, BlueProgrammer212DoesDevStuff
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
 
1. Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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

document.getElementById("profile_href").href = `https://blueprogrammer212.github.io/profile?id=${getCookie("pf_id")}`;

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

window.addEventListener("load", () => {
    setTimeout(() => { 
      if (auth2.isSignedIn.get()) {
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
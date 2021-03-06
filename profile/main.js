const regExpression = /|([^|]*)|/g
if (window.location.host !== "www.pixcel.ml") {
  window.location.href = "https://www.pixcel.ml/home"
}
const urlSearchParams_ = new URLSearchParams(window.location.search);
const params_ = Object.fromEntries(urlSearchParams_.entries());
document.getElementById("nameMod").addEventListener("keydown", (e) => { 
   if (e.key === "Enter") {
     e.preventDefault();
   }
})

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

class NotificationManager {
  constructor() {
    this.message = "";
    this.xhr = new XMLHttpRequest();
    this.url = "https://fcm.googleapis.com/fcm/send";
  }
  send(message, title, token, link, icon, server_token) {
      this.message = message;
      this.title = title;
      this.icon = icon;
      this.xhr.open("POST", this.url, true);
      const type = "json";
      this.xhr.setRequestHeader('Content-Type',`application/${type}`);
      if (server_token === void 0) return "Missing access! Please specify the server token to be verified!";
      if (message === void 0) return "Missing parameter! Please try again."
      if (link === void 0) return "Please specify a click action!";
      this.xhr.setRequestHeader('Authorization',`key=${server_token}`);    
      let data = JSON.stringify({"notification": {"body": this.message, "title": this.title,
      "click_action": link, "icon": this.icon}, "to": token, "priority": "high"})
      this.xhr.onreadystatechange = function() { 
        if (this.readyState == 4) {
          if (this.status == 200) {
            let resp=JSON.parse(this.responseText);
            console.log('Response Sent with params '+ data );
          } else {
            console.log('Something went wrong '+ this.responseText);
          }
        }
      };     
      setTimeout(this.xhr.send, 1000, data);
  }
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
let firestore;

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

const currentId = getCookie("pf_id");
setInterval(() => {
  if (getCookie("pf_id")!==currentId&&getCookie("pf_id")!==void 0) {
    console.log("[System] Setting your ID to your previous profile ID."); 
    setCookie("pf_id", currentId);
    firestore.collection("profiles").doc(currentId).update({banned: true, reason: "Unverified profile ID modification via XSS"})
    .then(() => window.location.reload())
  };
}, 1000); 

function deleteCookie( name, path, domain ) {
  if(getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? ";path="+path:"")+
    ((domain)?";domain="+domain:"") +
    ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function signOut() {
  auth2.signOut().then(function () {
    console.log('Clearing cookies... 0%');
    console.log(`Signing out... ${JSON.stringify(googleUser, undefined, 2)}`);
    let domain = "https://blueprogrammer212.github.io";
    deleteCookie("pfp_url", "/")
    deleteCookie("pf_id", "/")
    deleteCookie("pf_name", "/")
    deleteCookie("pf_email", "/");
    console.log('Succesfully cleared cookies. 100%');
    setTimeout(() => {
      window.location.href = "../"
    }, 800)
  });
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

function PD(e) {
  const o = ["stopPropagation", "preventDefault"];
  for (let io=0;io<o.length;++io) if(o[io]!==void 0) e[o[io]]();
}

function generateName(len = 10, char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
  let string = "";
  for (i = 1; i < len; ++i) {
     string += char[Math.round(Math.random() * len) + 1];
  }
  return string;
}

window.addEventListener("load", () => {
  setTimeout(async () => { 
    firebase.initializeApp(firebaseConfig);
    firestore = firebase.firestore();
    if (auth2.isSignedIn.get()) {
      let image_url = getCookie("pfp_url"), 
      name = getCookie("pf_name"),
      id = getCookie("pf_id");
      console.log(`Loading profile... ${new Profile(image_url, id, name)}`)
      document.getElementById("dropdown_ui_options").addEventListener("click", (e) => {
        document.getElementById("profileEditBg").className = "";
        const o = ["stopPropagation", "preventDefault"];for (let m=0;m<o.length;++m) e[o[m]]();
      })

      if ("id" in params_) firestore.collection("profiles").doc(params_.id).get().then((a) => {
        if (!a.exists && params_.id === getCookie("pf_id")) {
          firestore.collection("profiles").doc(params_.id).set({id: getCookie("pf_id"), name: getCookie("pf_name"), image_url: getCookie("pfp_url"), description: null, pending_friend_requests: [], friends: []}).then(() => {
              window.location.reload(); 
            })
          }
          if ("registerProfile" in params_ && params_.registerProfile == 'true') window.location.search = `?id=${getCookie("pf_id")}`
          if ("data" in a) document.getElementById("name_pfp")["innerHTML"] = a["data"]().name;
          document.getElementById("date_pfp").innerHTML = `Joined on ${a.data().date_joined}`; let p="data",l="length";
          
          if (a.data().id != getCookie("pf_id")) {
            document.getElementsByClassName("camera_change_pfp_bg")[0].className += " invisible"
          }
          
          if (a.data().id == getCookie("pf_id")) {
            document.getElementById("preview_description").innerHTML = a["data"]().description;
            const currentDescription = a.data().description;
            document.getElementById("description_update_profile")["addEventListener"]("input", e => {
              document.getElementById("preview_description").innerHTML = document.getElementById("description_update_profile").value; 
              if (document.getElementById("description_update_profile").value !== currentDescription) {} else {}
            })
            const st=!function(c=a,h=l){const g=c[p]().id;return (!(g[h]++>1)?1:0)}(a,l)==0?0:void 0;
            document.getElementsByClassName("camera_change_pfp_bg")[0].addEventListener("click", () => {
              document.getElementById("lth").className = "profileEditBg";
              document.getElementById("nameMod").value = a.data().name;
              let modal_box = document.getElementById("modalBoxProfileMod");
              const id = ["pfp_mod_profile","preview_pfp_mod_profile"];
              for (let j = 0; j < id.length; ++j) {if (id[j] !== void 0) document.getElementById(id[j]).src = a.data().image_url;}
              let save_btn = document.getElementById("save_information");
              save_btn.addEventListener("click", (e) => {
                  let value_name = document.getElementById("nameMod").value;
                  firestore.collection("profiles").doc(getCookie("pf_id")).update({name: value_name});
                  setCookie("pf_name", value_name)
              });
              modal_box.addEventListener("click", e => e.stopPropagation());
              modal_box.parentElement.addEventListener("click", () => {
                modal_box.parentElement.className = "invisible"
              })
            })
            document.getElementById("lth").addEventListener("click", e => e.stopPropagation());  
            for (let i = 0; i < a.data().pending_friend_requests.length; ++i) {
              document.getElementById("friendReq").appendChild(document.importNode(document.getElementById("temp_friend_req").content, true));
              firestore.collection("profiles").doc(a.data().pending_friend_requests[i].profile_id).get().then((nf) => {
                document.getElementsByClassName("pf_img_friend_request")[i].setAttribute("src", nf.data().image_url);
                document.getElementsByClassName("pf_img_friend_request")[i].onclick = function() {
                    window.location.search = `?id=${a.data().pending_friend_requests[i].profile_id}`;
                  };
                  
                  if (!("firestore") in firebase) return new Error("Firestore property is not defined.");
                  document.getElementsByClassName("accept_req")[i].onclick = async function() { 

                    if ("id" in params_ && params_.id == getCookie("pf_id")) {
                      await firestore.collection("profiles").doc(params_.id).update({"friends": firebase.firestore.FieldValue["arrayUnion"]({"profile_id": a.data().pending_friend_requests[i].profile_id}), "pending_friend_requests": 
                      firebase.firestore.FieldValue["arrayRemove"]({"profile_id": a.data().pending_friend_requests[i].profile_id})})
                      .then((v) => document.getElementsByClassName("accept_req")[i]["parentElement"].remove());
                    }
                    
                    if ("profile_id" in a.data().pending_friend_requests[i]) {
                      await firestore.collection("profiles").doc(a.data().pending_friend_requests[i].profile_id)
                      .update({"friends": firebase.firestore.FieldValue["arrayUnion"]({"profile_id": params_.id})})
                    }
                    
                  };
                  
                  document.getElementsByClassName("name_tag")[i].innerHTML = nf.data().name;
                })
              }
              document.getElementById("user_req").remove();
              console.log("[System] The search id parameter matches with your cookie.");
              if (typeof getCookie("pf_id") == typeof void 0)  {
                console.error("The cookie ID is not defined.")
                alert("Your id is not verified. You can resolve this issue by signing out and signing in again.")
              }
              document.getElementById("parent_editProfile").className = "align-left";
              document.getElementById("aboutMeEdit").value = a.data().description;
              document.getElementById("mutual_friends_pagination").innerHTML = "Friend Requests"
              document.getElementById("friendReq").className = "";
              document.getElementById("mutual_friends_pagination").onclick = function() {}
              document.getElementById("save_desc").onclick = function() {
                firestore.collection("profiles").doc(params_.id).update({description: document.getElementById("aboutMeEdit").value})
              }
            } else {
              if (params_.sendFr==1) {
                console.log("Sent friend request automatically")
                firestore.collection("profiles").doc(params_.id).update({pending_friend_requests: firebase.firestore.FieldValue.arrayUnion({
                  "profile_id": getCookie("pf_id")
                })}).then(() => document.getElementById("AddFriend").innerHTML = "Cancel Friend Request");
              }
              document.getElementById("friendReq").className = "";
              let info_, info;
              void async function init_information(b) {
                info = await firestore.collection("profiles").doc(params_.id).get().then(ca => ca);
                info_ = await firestore.collection("profiles").doc(getCookie("pf_id")).get().then(ca => ca);
                if (info.data().pending_friend_requests.some(function(x) {return x.profile_id === getCookie("pf_id")})) {
                  document.getElementById(b).innerHTML = "Cancel Friend Request"
                }
                if (info_.data().friends.some(function(x) {return x.profile_id === params_.id})) {
                  document.getElementById(b).innerHTML = `Unfriend ${info.data().name}?`;
                  document.getElementById(b).addEventListener("click", async () => {
                    firestore.collection("profiles").doc(getCookie("pf_id")).update({friends: 
                      firebase.firestore.FieldValue.arrayRemove({"profile_id": params_.id})})
                      firestore.collection("profiles").doc(params_.id).update({friends: firebase.firestore.FieldValue.arrayRemove({
                        "profile_id": getCookie("pf_id")
                      })}).then(() => document.getElementById(b).innerHTML = "Send Friend Request");
                      document.getElementById(b).addEventListener("click", async () => {
                        if (!info["data"]().pending_friend_requests.some((x) => {return x.profile_id === getCookie("pf_id")})) {
                          firestore.collection("profiles").doc(params_.id).update({pending_friend_requests: firebase.firestore.FieldValue.arrayUnion({
                            "profile_id": getCookie("pf_id")
                          })}).then(() => document.getElementById(b).innerHTML = "Cancel Friend Request");
                        } else {
                          firestore.collection("profiles").doc(params_.id).update({pending_friend_requests: firebase.firestore.FieldValue.arrayRemove({
                            "profile_id": getCookie("pf_id")
                          })}).then(() => document.getElementById(b).innerHTML = "Send Friend Request");
                        }
                      })
                    })
                  } else {
                   document.getElementById(b).addEventListener("click", async () => {
                     if (!info["data"]().pending_friend_requests.some((x) => {return x.profile_id === getCookie("pf_id")})) {
                      if (info.data().notification_token !== void 0) {
                        var hr = new XMLHttpRequest();
                        const url = "https://fcm.googleapis.com/fcm/send";
                        hr.open("POST", url, true);
                        hr.setRequestHeader('Content-Type','application/json');
                        hr.setRequestHeader('Authorization','key=AAAAetCW8sM:APA91bHrdCQy4pRXv6JSvI2VS3SGnS09fFT_91DISOXGI0LQ6d4Cd9nuHPXiAOucBAqz2xUNpUznlL_MTDrzLrSYQEvs0fYYV3tGza1cFDZ7DANW-4gjnpKIsJ85UwJklS0JEnMx5DJ8');      
                     
                        let data = JSON.stringify({"notification": {"body": `${getCookie("pf_name")} sent you a friend request.`,"title":"Pixcel",
                        "click_action": `https://blueprogrammer212.github.io/profile?id=${info.data().id}`,
                        "icon": getCookie("pfp_url")}, "to": info.data().notification_token, "priority": "high"})
                        hr.onreadystatechange = function() { 
                          if (hr.readyState == 4) {
                            if (hr.status == 200) {
                              resp=JSON.parse(hr.responseText);
                              console.log('Response Sent with params '+ data );
                             } else {
                               console.log('Something went wrong '+ hr.responseText);
                             }
                           }
                         };     
                         hr.send(data);
                       }            
                      firestore.collection("profiles").doc(params_.id).update({pending_friend_requests: firebase.firestore.FieldValue.arrayUnion({
                        "profile_id": getCookie("pf_id")
                      })}).then(() => document.getElementById(b).innerHTML = "Cancel Friend Request");
                      } else {
                        firestore.collection("profiles").doc(params_.id).update({pending_friend_requests: firebase.firestore.FieldValue.arrayRemove({
                        "profile_id": getCookie("pf_id")
                      })}).then(() => document.getElementById(b).innerHTML = "Send Friend Request");
                    }
                    })
                  }
              }("AddFriend")
              document.getElementById("aboutMeSection").className = "align-left"
              document.getElementById("aboutMeSection").innerHTML = a.data().description;
            }
            document.getElementById("img_pfp").src = a.data().image_url;  
          });
          console.log(`Loading username... NAME:${name}`)
          console.log(`Loading UserID... ID:<${id}>`)
          console.log(`Loading profile picture ${image_url}...`);
        firestore.collection("profiles").doc(getCookie("pf_id")).get().then(pfp_info => {
            pfp_img_elem.setAttribute("src", pfp_info.data().image_url);
        }).catch(e => console.error(`Something unexpected occured. ${e}`));
        document.getElementById("change_pfp").addEventListener("click", e => document.getElementById("uploadProfile").click())
        document.getElementById("uploadProfile").addEventListener("change", (evt) => {
          let generatedFileName = generateName();
          let storageRef = firebase.storage().ref(`profile_picture/${generatedFileName}.png`)
          let imageUpload = evt.target.files[0];
          let uploadTask = storageRef.put(imageUpload);
          uploadTask.then((snapshot) => { 
            console.log("Succesfully uploaded image: ", snapshot);
            let img_link = `https://firebasestorage.googleapis.com/v0/b/pixcel-272e8.appspot.com/o/profile_picture%2F${generatedFileName}.png?alt=media`
            firestore.collection("profiles").doc(currentId).update({image_url: img_link}).then(ab => {
              pfp_img_elem.setAttribute("src", img_link);
              document.getElementById("img_pfp").setAttribute("src", img_link);
              document.getElementById("pfp_mod_profile").src = img_link;
              console.log(`Successfully changed your profile picture. Image link: ${img_link}`)
            });
          }).catch((err) => {
              console.error(`Failed to upload image to cloud: ${JSON.stringify(err)}`);
          })
        })
        pfp_img_elem.addEventListener("click", () => {
          window.location.href = `?id=${getCookie("pf_id")}`;
        })
      } else {
        window.location.href = "https://blueprogrammer212.github.io/home/comments"
      }
      void async function checkIfBanned() {
         firestore.collection("profiles").doc(currentId).get().then((peers) => {
             if (peers.data().banned) window.location.href = "https://blueprogrammer212.github.io/home/comments/page/ban.html" ;
         })
      }()
      document.body.style = "";
    }, 2000)
    console.log(`Loading client content... ${document.body}`)
})
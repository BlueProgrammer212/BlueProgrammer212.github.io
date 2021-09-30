var googleUser = {};
let firestore;
let template_elem = document.getElementById("template_comment"), 
    parent = document.getElementById("comment_section");

class CommentManager {
   constructor(template, parent) {
      this.template = template;
      this.parent = parent;
      this.child = this.template.content.cloneNode(true);
   }
   generateKey(len=40) {
       let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
       let string;
       while (--len > 0) {
          string += chars[Math.round(Math.random()*chars.length-1)];
       }
       return string;
   }
   add(data) {
      for (let i = 0; i < data.length; ++i) {
        this.child = this.template.content.cloneNode(true);
        this.parent.appendChild(this.child);  
      }
   }
   post(data) {
      firestore.collection(`comments`).add(data).catch(err => {
        console.error(new Error(`Server failed to add comment, ${data}. ${err}`))
      })
    }
}

let comments = new CommentManager(template_elem, parent)

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

function saveToFirebase(email) {
  firebase.initializeApp(firebaseConfig);
  var emailObject = {
      email: email
  };

  firebase.database().ref('subscription-entries').push().set(emailObject)
      .then(function(snapshot) {
          console.log("works", snapshot);
      }, function(error) {
          console.log('error' + error);
      });
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

for (let i = 0; i < document.images.length; ++i) {
  document.images[i].oncontextmenu = function() {
    return false;
  }
}

let slug = "dead-sea"

console.log("%cWarning", "color:red;font-size:32px;");
console.log("%cPlease do not execute a malicious code here! You might give hackers access to your account!", "color:white;font-size:16px;");
console.log("%cSelf-XSS is a software attack to give hackers access to your account by convincing you to execute a malicious code into the developer console", "color:blue;font-size:16px");
console.log("%cLearn more at https://blueprogrammer212.github.io/self-xss", "color:blue;font-size:16px");

document.getElementById("post_btn").addEventListener("click", () => {
  comments.post({id: 'RZ4jQvrF0ea1i5sKkb6A', time: Date.now(), 
  slug: 'dead-sea', content: document.getElementById("post_comment").value, pld: null})
  document.getElementById("post_comment").value = "";
})

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
        document.body.style = "";

        firebase.initializeApp(firebaseConfig);
        firestore = firebase.firestore();
        firestore.collection(`comments`).onSnapshot(snapshot => {
          const posts = snapshot.docs
          .filter(doc => doc.data().slug === slug)
          .map(doc => {
            return { id: doc.id, ...doc.data() }
          });
          console.log(posts)
          comments.add(posts)
        })
      } else {
          window.location.href = "https://blueprogrammer212.github.io/home/comments";
      }
    }, 2000)
    console.log(`Loading client content... ${document.images}`)
})

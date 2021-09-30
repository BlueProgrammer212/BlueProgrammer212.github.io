var googleUser = {};
let firestore;
let template_elem = document.getElementById("template_comment"), 
    parent = document.getElementById("comment_section");

function clearDatabase() {
  if (prompt("PIN:")===`#9576`) {
    firestore.collection('comments').get().then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
          snapshot.ref.delete();
      })
    })
  }
}

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
   add() {
      try {
        for (let i = 0; i < arguments.length; ++i) {
              if (arguments[i] === void 0) {
                  throw new Error(`
                      The provided data is not valid. errcode: 0x972533
                `) 
              } else if (arguments[i].content === void 0) {
                throw new Error(`
                      The content string is not specified. errcode: 0x972534
                `);
              } else if (arguments[i].slug !== "pixcel") {
                throw new Error(`
                      The specified id is not verified. errcode: 0x972535
                `);
              } else if (arguments.length >= 5) {
                throw new Error(`
                      The provided arguments passed the limit. errcode: 0x972536
                `);
              }
              this.child = this.template.content.cloneNode(true);
              this.parent.appendChild(this.child);  
        }
      } catch(err) {
        console.error(err);
        return;
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

let slug = "pixcel";

document.getElementById("post_btn").addEventListener("click", () => {
  comments.post({id: 'RZ4jQvrF0ea1i5sKkb6A', time: Date.now(), 
  slug: 'pixcel', content: document.getElementById("post_comment").value, pld: null})
  document.getElementById("post_comment").value = "";
})

let posts;
let loadedComments = false;
let mx_;
console.log(`%cPPPPPPPPPPPPPPPPP   IIIIIIIIIIXXXXXXX        XXXXXXX       CCCCCCCCCCCCCEEEEEEELLLLLLLLLLLLL        
P::::::::::::::::P  I::::::::IX:::::X       X:::::X     CCC::::::::::::CE::::::::::::::::::::EL:::::::::L             
P::::::PPPPPP:::::P I::::::::IX:::::X       X:::::X   CC:::::::::::::::CE::::::::::::::::::::EL:::::::::L             
PP:::::P     P:::::PII::::::IIX::::::X     X::::::X  C:::::CCCCCCCC::::CEE::::::EEEEEEEEE::::ELL:::::::LL             
  P::::P     P:::::P  I::::I  XXX:::::X   X:::::XXX C:::::C       CCCCCC  E:::::E       EEEEEE  L:::::L               
  P::::P     P:::::P  I::::I     X:::::X X:::::X  C:::::C                 E:::::E               L:::::L               
  P::::PPPPPP:::::P   I::::I      X:::::X:::::X   C:::::C                 E::::::EEEEEEEEEE     L:::::L               
  P:::::::::::::PP    I::::I       X:::::::::X    C:::::C                 E:::::::::::::::E     L:::::L               
  P::::PPPPPPPPP      I::::I       X:::::::::X    C:::::C                 E:::::::::::::::E     L:::::L               
  P::::P              I::::I      X:::::X:::::X   C:::::C                 E::::::EEEEEEEEEE     L:::::L               
  P::::P              I::::I     X:::::X X:::::X  C: ::::C                E:::::E               L:::::L               
  P::::P              I::::I  XXX:::::X   X:::::XXXC :::::C       CCCCCC  E:::::E       EEEEEE  L:::::L         LLLLLL
PP::::::PP          II::::::IIX::::::X     X::::::X  C:::::CCCCCCCC::::CEE::::::EEEEEEEE:::::ELL:::::::LLLLLLLLL:::::L
P::::::::P          I::::::::IX:::::X       X:::::X   CC:::::::::::::::CE::::::::::::::::::::EL::::::::::::::::::::::L
P::::::::P          I::::::::IX:::::X       X:::::X     CCC::::::::::::CE::::::::::::::::::::EL::::::::::::::::::::::L
PPPPPPPPPP          IIIIIIIIIIXXXXXXX       XXXXXXX        CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLLLLLLLLLLLLL`, `
    font-size: 3px;font-weight: 9px
`)

window.addEventListener("load", () => {
    setTimeout(() => {
      if (auth2.isSignedIn.get()) {
        let image_url = getCookie("pfp_url"), 
        name = getCookie("pf_name"),
        id = getCookie("pf_id");

        console.log(`Loading profile... ${JSON.stringify(new Profile(image_url, id, name))}`)
        console.log(`Loading username... Name:${name}`)
        console.log(`Loading UserID... Id:<${id}>`)
        console.log(`Loading profile picture ${image_url}...`) 

        pfp_img_elem.setAttribute("src", image_url);
        document.body.style = "";

        firebase.initializeApp(firebaseConfig);
        firestore = firebase.firestore();

        firestore.collection(`comments`).onSnapshot(snapshot => {
            posts = snapshot.docs
            .filter(doc => doc.data().slug === slug)
            .map(doc => {
              return { id: doc.id, ...doc.data() }
            });
            
            console.log(`Loading comments 0%... ${posts}`)
        })
      } else {
          window.location.href = "https://blueprogrammer212.github.io/home/comments";
      }
      (function() {
        console.log("%cWarning", "color:red;font-size:32px;");
        console.log("%cPlease do not execute a malicious code here! You might give hackers access to your account!", "color:white;font-size:16px;");
        console.log("%cSelf-XSS is a software attack to give hackers access to your account by convincing you to execute a malicious code into the developer console", "color:blue;font-size:16px");
        console.log("%cLearn more at https://blueprogrammer212.github.io/self-xss", "color:blue;font-size:16px");
       }());
    }, 2100);
    console.log(`Loading client content... ${document.images}`)
})

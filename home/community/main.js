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
let image_url_ =  getCookie("pfp_url") || "../assets/default_pfp_16x16.png";
(function() {
    var googleUser = {};
    let firestore;
    
    function disableDrag() {
      for (let i = 0; i < document.images.length; i++) {
        document.images[i].setAttribute("draggable", false);
      }
    }
  
    disableDrag();
      
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
    
    const startApp = () => {
        gapi.load('auth2', function () {
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
    
    if (getCookie("banned")) {
        location.href = "https://blueprogrammer212.github.io/home/comments/page/ban.html?b=true#24567845847463534647658746";
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

  function generateName(len = 10, char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
      let string;
      for (i = 1; i < len; ++i) {
         string += char[Math.round(Math.random() * len) + 1];
      }
      return string;
  }

  window.addEventListener("load", () => {
      setTimeout(() => {
        if (auth2.isSignedIn.get()) {
          image_url = getCookie("pfp_url");
          let name = getCookie("pf_name"),
          id = getCookie("pf_id");
  
          console.log(`Loading profile... ${JSON.stringify(new Profile(image_url, id, name))}`);
          console.log(`Loading username... Name:${name}`);
          console.log(`Loading UserID... Id:<${id}>`);
          console.log(`Loading profile picture ${image_url}...`);
  
          pfp_img_elem.setAttribute("src", image_url);
          firebase.initializeApp(firebaseConfig);
          firestore = firebase.firestore();
          let fileUpload = document.getElementById("uploadImage")
        
          fileUpload.addEventListener('change', function(evt) {
              let generatedFileName = generateName();
              let storageRef = firebase.storage().ref(`uploads/${generatedFileName}.png`)
              let imageUpload = evt.target.files[0];
              let uploadTask = storageRef.put(imageUpload);
              uploadTask.then((snapshot) => { 
                  console.log("Succesfully uploaded image: ", snapshot);
                   let img_link = `/uploadImg[https://firebasestorage.googleapis.com/v0/b/pixcel-272e8.appspot.com/o/uploads%2F${generatedFileName}.png?alt=media]`
                  document.getElementById("post_content").value += img_link;
              }).catch((err) => {
                  console.error(`Failed to upload image to cloud: ${JSON.stringify(err)}`);
              })
          });

        } else {
            window.location.href = "https://blueprogrammer212.github.io/home/comments";
        }
        (function() {
          console.log("%cWarning", "color:red;font-size:32px;");
          console.log("%cPlease do not execute a malicious code here! You might give hackers access to your account!", "color:white;font-size:16px;");
          console.log("%cSelf-XSS is a software attack to give hackers access to your account by convincing you to execute a malicious code into the developer console", "color:blue;font-size:16px");
          console.log("%cLearn more at https://blueprogrammer212.github.io/self-xss", "color:blue;font-size:16px");
         }());
      }, 100);
      console.log(`Loading client content... ${document.images}`)
  })

}());
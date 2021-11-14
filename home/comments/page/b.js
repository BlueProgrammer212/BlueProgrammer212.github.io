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
      
      var startApp = function() {
        gapi.load('auth2', function(){
          auth2 = gapi.auth2.init({
            client_id: '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin'
          });
        });
      };
      
      startApp()
      
    for (let i = 0; i < document.images.length; ++i) {
        document.images[i].oncontextmenu = function() {
        return false;
        }
    }
    
    document.body.style = "";
    
    
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
            firebase.initializeApp(firebaseConfig);
            firestore = firebase.firestore();

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
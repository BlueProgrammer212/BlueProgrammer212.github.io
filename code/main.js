//Firebase implementation 

Math.secant = function(x) {
    return 1 / Math.cos(x)
  }
  
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
  
      firestore.collection("profiles").doc(getCookie("pf_id")).get().then(pfp_info => {
        pfp_elem.setAttribute("src", pfp_info.data().image_url);
      }).catch(e => console.error(`Something unexpected occured. ${e}`));
      
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
  
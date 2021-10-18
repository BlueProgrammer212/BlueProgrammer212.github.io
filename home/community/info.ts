import FragmentManager from "./ts/FragmentManager.js";

let fragmentInstance = new FragmentManager("template_posts", "../assets/default_pfp_16x16.png");

window.addEventListener("load", () => {
    setTimeout(() => {  
        let noPosts : any = document.getElementById("noPosts");
        firestore = firebase.firestore();
        firestore.collection("posts").where("region", "==", "AS").onSnapshot((querySnapshot) => {
            if (!noPosts.className.includes("invisible")) {
                noPosts.className += " invisible";
            };
            querySnapshot.docChanges().forEach(change => {
                if (change.type == "added") {
                    fragmentInstance.add(change.doc.data());
                }
            });
            querySnapshot.forEach((doc) => {
                console.log(doc.data()); 
            });
        });
    }, 1000);
})
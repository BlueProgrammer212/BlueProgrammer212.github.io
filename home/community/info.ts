class FragmentManager {
    protected template_id : string;
    protected template_element : any;
    constructor(template_id : string) {
         this.template_id = template_id;
         this.template_element = document.getElementById(this.template_id)
    } 
    add(data : Object) {
        console.log(data);
    }
}

window.addEventListener("load", () => {
    setTimeout(() => {  
        let noPosts : any = document.getElementById("noPosts");
        firestore = firebase.firestore();
        firestore.collection("posts").get().then((querySnapshot) => {
            if (!noPosts.className.includes("invisible")) {
                noPosts.className += " invisible";
            };
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
            });
        });
    }, 1000);
})
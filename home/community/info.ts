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
        firestore = firebase.firestore();
        firestore.collection("posts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.trace(doc);
            });
        });
    }, 1000);
})
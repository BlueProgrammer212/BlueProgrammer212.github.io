class FragmentManager {
    protected template_id : string;
    protected template_element : any;
    public template_element_clone : any;
    constructor(template_id : string) {
         this.template_id = template_id;
         this.template_element = document.getElementById(this.template_id)
    } 
    add(data) {
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        document.getElementById("main_content").appendChild(this.template_element_clone);
        for (let i = 0; i < document.getElementsByClassName("comment_message").length; ++i) {
            if (document.getElementsByClassName("comment_message")[i].innerHTML.length == 0) {
                 document.getElementsByClassName("comment_message")[i].innerHTML = data.message;
            }
        }
    }
}

let fragmentInstance = new FragmentManager("template_posts");

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
                fragmentInstance.add(doc.data());
            });
        });
    }, 1000);
})
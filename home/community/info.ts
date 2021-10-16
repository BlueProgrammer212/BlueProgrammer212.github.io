let regexp_parameter = /\[(.*?)\]/;
let inputBox : String;

class FragmentManager {
    protected template_id : string;
    protected template_element : any;
    public template_element_clone : any;
    public image_upload : any;
    protected comment_message : any;
    protected defaultPfp : String;
    protected pfp_element : any;
    constructor(template_id : string, defaultPfp_ : String) {
         this.template_id = template_id;
         this.template_element = document.getElementById(this.template_id);
         this.image_upload = document.getElementsByClassName("img_upload");
         this.comment_message = document.getElementsByClassName("comment_message");
         this.defaultPfp = defaultPfp_;
         this.pfp_element = document.getElementsByClassName("pfp_img_elem");
    } 
    protected setMessage(message : String) {
        for (let i = 0; i < this.comment_message.length; ++i) {
            this.comment_message[i].innerHTML = message;
        }
    }
    protected setImage(link : string) {
        for (let i = 0; i < this.pfp_element.length; ++i) {
            if (this.pfp_element[i].getAttribute("src") == this.defaultPfp) {
                document.getElementsByClassName("pfp_img_elem")[i].setAttribute("src", link);
            }
        }
    } 
    add(data) {
        const {pfp_link, message} = data;
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.image_upload = document.getElementsByClassName("img_upload");
        document.getElementById("titles").appendChild(this.template_element_clone);

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            inputBox = document.getElementsByClassName("comment_message")[i].innerHTML;
            if (inputBox.length == 0 && !inputBox.startsWith("/uploadImg[")) {
              this.setMessage(message);
              this.image_upload[i].setAttribute("src", inputBox.substr(0, 10));
              console.log(inputBox.substr("/uploadImg".length + 1, inputBox.length - 1))
            }
        }
        this.setImage(pfp_link);
    }
}

let fragmentInstance = new FragmentManager("template_posts", "../assets/default_pfp_16x16.png");

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
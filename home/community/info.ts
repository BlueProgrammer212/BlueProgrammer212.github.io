let inputBox : any;

console.log(firebase)

interface Fragment {
    template_id : string,
    template_element: any,
    image_upload: any,
    comment_message: any,
    defaultPfp: String,
    pfp_element: any
}

class FragmentInstance implements Fragment {
    template_id : string;
    template_element : any;
    template_element_clone : any;
    image_upload : any;
    comment_message : any;
    defaultPfp : String;
    pfp_element : any;
    constructor(template_id : string, defaultPfp_ : String) {
         this.template_id = template_id;
         this.template_element = document.getElementById(this.template_id);
         this.image_upload = document.getElementsByClassName("img_upload");
         this.comment_message = document.getElementsByClassName("comment_message");
         this.defaultPfp = defaultPfp_;
         this.pfp_element = document.getElementsByClassName("pfp_img_elem");
    } 
    protected setImage(link : string) {
        for (let i = 0; i < this.pfp_element.length; ++i) {
            if (this.pfp_element[i].getAttribute("src") == this.defaultPfp) {
                document.getElementsByClassName("pfp_img_elem")[i].setAttribute("src", link);
            }
        }
    } 
}

interface FragmentExtension {
    readonly parent: any,
}

interface FileSystemInstance {
    data: any 
}

class FragmentManager extends FragmentInstance implements FragmentExtension {
    public readonly parent : any;
    protected remove(fs : FileSystemInstance, name : string): Promise<void> {
        return new Promise(async (res) => {
            await fs.data.firestore.collection("posts").doc(name).delete().then(() => {
                setTimeout(res, 1000, undefined);
            }).catch(err => console.error(new Error(err)));
            console.log("[System] %c Removed posts in 1.6s", "color: violet;");
            
        });
    }
    constructor(template_id : string, defaultPfp_ : String) {
         super(template_id, defaultPfp_);
         this.parent = document.getElementById("titles");
    } 

    add(data) {
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.parent.appendChild(this.template_element_clone);

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            inputBox = document.getElementsByClassName("comment_message")[i].innerHTML;

            if (inputBox.length == 0 && !inputBox.startsWith("/uploadImg[")) {
                document.getElementsByClassName("comment_message")[i].innerHTML = data.message;
                inputBox = document.getElementsByClassName("comment_message")[i].innerHTML;
                document.getElementsByClassName("img_upload")[i].setAttribute("src", 
                inputBox.match(/\[(.*?)\]/)[1]);
            }
            
        }
        this.setImage(data.pfp_link);
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
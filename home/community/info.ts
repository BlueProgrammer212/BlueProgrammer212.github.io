let inputBox : any;

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
    protected setMessage(msg : string, i : number) {
        document.getElementsByClassName("comment_message")[i].innerHTML = msg;
    }
}

interface FragmentExtension {
    readonly parent: any,
}

interface Data {
     message: string;
     pfp_link: string;
     name: string; 
}

class FragmentManager extends FragmentInstance implements FragmentExtension {
    public readonly parent : any;
    public set : any;

    remove(fs, name: string): Promise<void> {
        return new Promise(async (res) => {
            await fs.collection("posts").doc(name).delete().then(() => {
                setTimeout(res, 1000, undefined);
            }).catch(err => console.error(new Error(err)));
            console.log("[System]%c Removed posts in 1.6s", "color: violet;font-style: bold;");
            
        });
    }
    constructor(template_id : string, defaultPfp_ : String) {
         super(template_id, defaultPfp_);
         this.parent = document.getElementById("titles");
         this.set = new Set();
    } 

    add(data: Data) {
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.parent.appendChild(this.template_element_clone);
        for (let j = 0; j < document.getElementsByClassName("pfp_name").length; ++j) {
            document.getElementsByClassName("pfp_name")[j].innerHTML = data.name;
        }

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            inputBox = document.getElementsByClassName("comment_message")[i].innerHTML;

            if (inputBox.length == 0 && !data.message.startsWith("!uploadImg[")) {
                this.setMessage(data.message, i);
            } else if (data.message.startsWith("!uploadImg[")) {
                this.setMessage(data.message, i);
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
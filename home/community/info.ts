let inputBox : any;

interface Fragment {
    template_id : string,
    template_element: any,
    image_upload: any,
    comment_message: any,
    defaultPfp: String,
    pfp_element: any
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
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
    setMessage(msg : string, i : number): void {
        document.getElementsByClassName("comment_message")[i].innerHTML = msg;
    }
    setTime(time : string, i : number): void {
        document.getElementsByClassName("timeStamp")[i].innerHTML = `Published on ${time}`;
    }
    setName(name : string, i : number): void {
        document.getElementsByClassName("pfp_name")[i].innerHTML = name;
    }
    loadImage(src : string, i: number): Promise<void> {
        return new Promise((resolve) => {
            if (document.getElementsByClassName("img_upload")[i]) {
                document.getElementsByClassName("img_upload")[i].setAttribute("src", src)

            document.getElementsByClassName("img_upload")[i]
                    .addEventListener("load", () => setTimeout(resolve, 0, null));
            }
        })
    }
}

interface FragmentExtension {
    readonly parent: any,
}

interface Data {
     message: string;
     pfp_link: string;
     name: string; 
     date_published: string;
}



const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

class FragmentManager extends FragmentInstance implements FragmentExtension {
    public readonly parent : any;
    public set : any;
    public msg: any;

    remove(fs, name: string): Promise<void> {
        return new Promise(async (res) => {
            await fs.collection("posts").doc(name).delete().then(() => {
                setTimeout(res, 1000, undefined);
            }).catch(err => console.error(new Error(err)));
            console.log("[System]%c Removed posts in 1.6s", "color: violet;font-style: bold;");
            
        });
    }
    
    protected update(i : number): void {
        this.msg = document.getElementsByClassName("comment_message")[i].innerHTML;
    }
    
    constructor(template_id : string, defaultPfp_ : String) {
         super(template_id, defaultPfp_);
         this.parent = document.getElementById("titles");
         this.set = new Set();
    } 

    setPosts(data : Data, i : number) {
        this.update(i);
        if (this.msg.length == 0 && !data.message.startsWith("/uploadImg[")) {
            this.setMessage(data.message, i);
            this.setTime(data.date_published, i);
            this.setName(data.name, i);
            document.getElementsByClassName("img_upload")[i].setAttribute("class", "invisible img_upload")
        }

        this.update(i);
        if (this.msg.length == 0 && data.message.startsWith("/uploadImg[")) {
            this.setMessage(data.message, i);
            this.setTime(data.date_published, i);
            this.setName(data.name, i);

            console.log("[System]%c", "Loading resource image... 0pc %c", "color: violet;", "color: white;");
            this.loadImage(data.message.match(/\[(.*?)\]/)[1], i).then(() => {
                console.log("[System]%c", "Loading resource image... 100% pc%c", "color: violet;", 100, "color: white;");
            })
            console.log("[System]%c", "Loaded image resource successfully%c", "color: violet;", "color: white;");
            document.getElementsByClassName("img_upload")[i].addEventListener("click", () => {
                window.location.search = `?p=${data.message.match(/\[(.*?)\]/)[1].substr(
                data.message.match(/\[(.*?)\]/)[1].search("undefined"), 18)}&r=AS`;
            });
            if ("r" in params && params.r == "AS" && "p" in params) {
                document.getElementById("bg_prev").className = "";
                document.getElementById("img_prev").setAttribute("src", `https://firebasestorage.googleapis.com/v0/b/pixcel-272e8.appspot.com/o/uploads%2F${params.p}.png?alt=media`);
            } else {
                document.getElementById("bg_prev").className = "invisible";
            }
        }
    }

    add(data: Data) {
        console.log(`%c[System] ` + `%cLoading posts... ${JSON.stringify(data)}`, "color: violet;font-style: bold;", "");
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.parent.appendChild(this.template_element_clone);

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            this.setPosts(data, i);
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
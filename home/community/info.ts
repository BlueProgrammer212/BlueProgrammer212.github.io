let inputBox : any;
let firestore;
let messaging;
//Declaration of Javascript constants.
declare let mat4: any;
//////////////////////////////////////

interface Fragment {
    template_id : string,
    template_element: any,
    image_upload: any,
    comment_message: any,
    defaultPfp: String,
    pfp_element: any
}

interface String {
    makeURL: Function;
    isUrl: Function;
}

interface NotificationBody {
    message: string;
    xhr: XMLHttpRequest;
    url: string;
}

class NotificationManager implements NotificationBody {
    message: string;
    xhr: XMLHttpRequest;
    url: string;
    protected readonly serverToken : string;
    constructor(serverToken : string) {
      this.message = "";
      this.xhr = new XMLHttpRequest();
      this.url = "https://fcm.googleapis.com/fcm/send";
      this.serverToken = serverToken;
    }
    send(message : string, title : string, token : string, link : string, icon : string): void {
        this.message = message;
        this.xhr.open("POST", this.url, true);
        this.xhr.setRequestHeader('Content-Type','application/json');
        this.xhr.setRequestHeader('Authorization',`key=${this.serverToken}`);      
    
        let data = JSON.stringify({"notification": {"body": message,"title": title,
        "click_action": link, "icon": icon}, "to": token, "priority": "high"})
         this.xhr.send(data);
    }
}

String.prototype.isUrl = function() {
    let url;
    try {
        url = new URL(this);
    } catch(_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol == "https:";
}

String.prototype.makeURL = function() {
     if (this.isUrl()) return this.link(this) 
    return this;
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

class CommentManager {
    parent_element: any;
    clone: any;
    PROFILE_PICTURE_INDEX: any;
    MESSAGE_ELEMENT_INDEX: any;

    public template_element: any;
    constructor(parent_id) {
        this.parent_element = document.getElementsByClassName(parent_id);
        this.template_element = document.getElementById("template_comments_posts");
        this.PROFILE_PICTURE_INDEX = 0;
        this.MESSAGE_ELEMENT_INDEX = 1;
    } 
    add(id, message : string, image): void {
        if (message.length > 0) {
            this.clone = document.importNode(this.template_element.content, true).children[0];
            let combox : any = this.clone.children[0];
            combox.children[this.MESSAGE_ELEMENT_INDEX].innerHTML = `${message}`;
            combox.children[this.PROFILE_PICTURE_INDEX].src = image;
            let patt = /\((\d+)\)/;
            document.getElementById(id).children[0].children[10].innerHTML = `View Comments (${Number(document.getElementById(id).children[0].children[10].innerHTML.match(patt)[1])+1})`
            document.getElementById(id).children[0].children[11].appendChild(this.clone);
        }
    }
    deleteComment(id): void {}
    editComment(id, message : string): void {}
}

const DATA_ID_ATTRIBUTE : string = "data-id";
document.getElementsByTagName("exit-prev")[0].addEventListener("load", () => {
    if (Number(this.getAttribute(DATA_ID_ATTRIBUTE))==1) {if (this.getAttribute("src")!==void 0){

        this.addEventListener("click", () => {
            this.parentElement.className += " invisible";
        })

        let loadExitButtonImg=document.createElement("IMG");
        loadExitButtonImg.setAttribute("src", this.getAttribute("src"));
        const o : string[] = ["width","height"];

        for (let x=0,i=1,s=0;x<o.length&&i==1;++x) {
            if (o[x]===void s) {break};if (o[x]!=="width"||o[x]!=="height") o.splice(x, i); 
            let l = (typeof Number(this.getAttribute("data-set-size")) == typeof s ? ()=>{
            loadExitButtonImg[o[x]] = this.getAttribute("data-set-size")} : ()=>{return;});l()
        }
        /*NON-PRODUCTION code. Press ALT+CURSOR UP in line 70 to disable.
        */
        loadExitButtonImg.className = "invisible";

        document.getElementsByTagName("exit-prev")[0].appendChild(loadExitButtonImg)
    }}
})

class FragmentInstance implements Fragment {
    template_id : string;
    template_element : any;
    template_element_clone : any;
    image_upload : any;
    comment_message : any;
    defaultPfp : String;
    pfp_element : any;
    a: Array<any>;
    commentManager: any;
    q: any;
    constructor(template_id : string, defaultPfp_ : String) {
         this.template_id = template_id;
         this.template_element = document.getElementById(this.template_id);
         this.image_upload = document.getElementsByClassName("img_upload");
         this.comment_message = document.getElementsByClassName("comment_message");
         this.defaultPfp = defaultPfp_;
         this.pfp_element = document.getElementsByClassName("pfp_img_elem");
         this.a = [];
         this.commentManager = new CommentManager("comment_section_post");
    } 
    protected setImage(link : string, i, name : string) {
        if (this.pfp_element[i].getAttribute("src") == this.defaultPfp) {
            document.getElementsByClassName("pfp_img_elem")[i].setAttribute("src", link);
            document.getElementsByClassName("pfp_img_elem")[i].setAttribute("title", name);
            document.getElementsByClassName("pfp_img_elem")[i].addEventListener("contextmenu", () => {return;})
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
    updateLikeField(data, integer: number, i) {
        this.q.forEach(async (docs) => {
            console.log(`Checking ID <${docs.data().id}>`)
            var uuid = await firestore.collection("posts").doc(docs.id).get().then(a => a.data());  
            if (uuid.id == this.a[i]) {
                firestore.collection("posts").doc(docs.id).update({likes: firebase.firestore.FieldValue.increment(integer)})
                data.likes = uuid.likes + integer;
            }
        })
    }
    update_likes(data : Data) {
        console.log(`Processing data to information, <${data.id}>`);
        document.getElementById(data.id).children[0].children[7].innerHTML = data.likes;
    }
    updateQuery(q): typeof q {
        this.q = q;
        return this.q;
    }
    updateComments(data) {
        for (let i = 0; i < data.comments.length; ++i) {
            this.commentManager.add(data.id, data.comments[i].message, data.comments[i].pfp);
        }
    }
    setButton(data, i: number): void {
        const prop : string = "value";
        let comment : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("comment-input") as HTMLCollectionOf<HTMLElement>;
        comment[i].onkeydown = (e) => {
            if (e.key == "Enter") {
                this.q.forEach(async (docs) => {
                    console.log(`Checking ID <${docs.data().id}>`)
                    var uuid = await firestore.collection("posts").doc(docs.id).get().then(a => a.data());  
                    if (uuid.id == this.a[i]) {
                        this.commentManager.add(uuid.id, comment[i][prop], getCookie("pfp_url"))
                        firestore.collection("posts").doc(docs.id).update({comments: firebase.firestore.FieldValue.arrayUnion(
                            {"message": comment[i][prop], "pfp":  getCookie("pfp_url"), "post_index": i, "region-uuid": Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
                        )}).then(a => {comment[i][prop] = "";});
                     }
                })
            }
        }
        let like : HTMLCollectionOf<HTMLElement> = document.
            getElementsByClassName("likeBtn") as HTMLCollectionOf<HTMLElement>,
            dislike : HTMLCollectionOf<HTMLElement> = document.
            getElementsByClassName("dislikeBtn") as HTMLCollectionOf<HTMLElement>;
        like[i].onclick = () => { 
           dislike[i].className = "dislikeBtn";
            if (!like[i].className.includes("likeBtnPressed")) {
                like[i].className += " likeBtnPressed";  
                this.updateLikeField(data, 1, i)
            } else {
                like[i].className = "likeBtn";
                if (data.likes > 0) this.updateLikeField(data, -1, i)
            }
        };
        dislike[i].onclick = () => {
            like[i].className = "likeBtn";
            if (data.likes > 0) this.updateLikeField(data, -1, i)
            if (!dislike[i].className.includes("dislikeBtnPressed")) {
                dislike[i].className += " dislikeBtnPressed"
            } else {
                dislike[i].className = "dislikeBtn";
                this.updateLikeField(data, 1, i);
            }
        };
    }
}

interface FragmentExtension {
    readonly parent: any,
}

interface Data {
     readonly message: string;
     readonly pfp_link: string;
     readonly name: string; 
     readonly date_published: string;
     dislikes: any;
     comments: any;
     likes: any;
     readonly id: any;
     readonly profile_id: any;
     readonly filename: string;
}

let urlSearchParams : URLSearchParams = new URLSearchParams(window.location.search);
let params = Object.fromEntries(urlSearchParams.entries());

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

interface Axis {
    x: number;
    y: number;
}

class Vector2<Axis> {
    x: number;
    y: number;
    static ZERO(): any {
        return new Vector2;
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    public scalar(s: number): object {
        this.x = this.x + s;
        this.y = this.y + s;
        let {x, y} = this;
        return {x, y};
    }
    get magnitude(): number {
       return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    public set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    public setVector(b: Vector2<Axis>): Vector2<Axis> {
        this.x = b.x;
        this.y = b.y; 
        return b;
    }
}

let btn_pfp = document.getElementById("ctx_btn_menu");
let profile_img = document.getElementById("pfp_edit_img");
let profile_img_webgl_canvas = document.getElementById("profile_img");

(btn_pfp || document.getElementById("ctx_btn_menu")).addEventListener("click", () => {
    window.location.href = `https://blueprogrammer212.github.io/profile?id=${getCookie("pf_id")}`
});

profile_img_webgl_canvas.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
})

profile_img.addEventListener("click", () => {
    profile_img.className = "blackColorRectBg invisible"
})

class DatabaseManager {
    firestore: any;
    constructor(firestore) {
        this.firestore = firestore;
    }
    edit(collection : string, document : string, property : string, data : any): void {
        this.firestore.collection(collection).doc(document).update(property, data);
    }  
    add(collection : string, document_name : string, data : any): void {
        this.firestore.collection(collection).doc(document_name).set(data)    
    }
} 

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("invisible", entry.isIntersecting);
    })
})

class FragmentManager extends FragmentInstance implements FragmentExtension {
    public readonly parent : any;
    public set : any;
    public msg: any;
    public prefix_url: any;

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
         this.prefix_url = "https://lh3.googleusercontent.com/a-/";
    } 

    setPosts(data : Data, i : number) {
        observer.observe(document.getElementsByClassName("postsBox")[i])
        this.update(i);
        firestore.collection("profiles").doc(data.profile_id).get().then((p_info) => {
            this.setImage(p_info.data().image_url, i, p_info.data().name);
        })
        if (this.msg.length == 0 && !data.message.startsWith("/uploadImg[")) {
            this.setMessage(data.message, i);
            this.setTime(data.date_published, i);
            firestore.collection("profiles").doc(data.profile_id).get().then((p_info) => {
                this.setName(p_info.data().name, i);
            })
            document.getElementsByClassName("img_upload")[i].setAttribute("class", "invisible img_upload")
        }

        //Send profile data to https://www.pixcel.ml/profile
        document.getElementsByClassName("profile_picture_32x32")[i].setAttribute("onclick", `
             if (history.pushState) {
                var newurl = 'https://www.pixcel.ml/profile?id=${data.profile_id}';
                window.history.pushState({path:newurl},'',newurl);
                window.location.reload();
             } else {
                 window.location.href = 'https://www.pixcel.ml/profile?id=${data.profile_id}'
             }
        `);

        this.update(i);
        if (this.msg.length == 0 && data.message.startsWith("/uploadImg[")) {
            this.setMessage(data.message, i);
            this.setTime(data.date_published, i);
        
            firestore.collection("profiles").doc(data.profile_id).get().then((p_info) => {
                this.setName(p_info.data().name, i);
            })

            console.log("%c[System]" + "%c Loaded image resource successfully", "color: violet;", "color: white");
            this.loadImage(data.message.match(/\[(.*?)\]/)[1], i).then(() => {
                console.log("%c[System]" + "%c Loading resource image... 100%", "color: violet;", "color: white;");
            })
            console.log("%c[System]" + "%c Loaded image resource successfully", "color: violet;", "color: white");
            document.getElementsByClassName("img_upload")[i].addEventListener("click", () => {
                if (history.pushState) {
                    var newurl = `https://www.pixcel.ml/home/community/?p=${data.filename}&r=AS`;
                    window.history.pushState({path:newurl},'',newurl);

                    urlSearchParams = new URLSearchParams(window.location.search);
                    params = Object.fromEntries(urlSearchParams.entries());       

                    let url_resource : string = `https://pixcelcdn.bprog212.repl.co/?id=${params.p}&s=512&requestedEntity=${data.profile_id}`,
                        url_resource_media_image : string = `https://firebasestorage.googleapis.com/v0/b/pixcel-272e8.appspot.com/o/uploads%2F${params.p}.png?alt=media`
                    document.getElementById("bg_prev").className = "";

                    document.getElementById("img_prev").setAttribute("src", url_resource_media_image);
                    document.getElementById("img_prev").oncontextmenu = () => {return;}
                    let a_elem_open_original = document.getElementById("open_original_a");
                    a_elem_open_original.addEventListener("click", (event) => {
                        if ("preventDefault" in event) event.preventDefault();
                        if ("stopPropagation" in event) event.stopPropagation();
                        console.log(`[Redirect] Redirecting to ${url_resource}`);
                        setTimeout(() => {window.open(url_resource, "self", "width=1024,height=1024")}, 100);  
                    });
                    document.getElementById("open_original_a").setAttribute("title", url_resource);
                }
            });
            if ("r" in params && params.r == "AS" && "p" in params) {
                document.getElementById("bg_prev").className = "";
                document.getElementById("img_prev").setAttribute("src", `https://firebasestorage.googleapis.com/v0/b/pixcel-272e8.appspot.com/o/uploads%2F${params.p}.png?alt=media`);
            } else {
                document.getElementById("bg_prev").className = "invisible";
            }
        }
    }

    add(data: Data, q) {
        console.log(`%c[System] ` + `%cLoading posts... ${JSON.stringify(data)}`, "color: violet;font-style: bold;", "");
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.template_element_clone.id = data.id;
        this.parent.appendChild(this.template_element_clone);
        this.update_likes(data);
        this.updateQuery(q);
        this.a.push(data.id);

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            this.setPosts(data, i);
            this.setButton(data, i); 
            document.getElementsByClassName("pfp_comment")[i].setAttribute("src", getCookie("pfp_url"));
        }
    }
}

let fragmentInstance = new FragmentManager("template_posts", "../assets/default_pfp_16x16.png");

document.getElementById("img_prev").parentElement.parentElement.addEventListener("click", () => {
    document.getElementById("img_prev").parentElement.parentElement.className = "invisible";
    if (history.pushState) {
        var newurl = `https://www.pixcel.ml/home/community/`;
        window.history.pushState({path:newurl},'',newurl);
     }
})

document.getElementById("img_prev").parentElement.addEventListener("mousewheel", (e) => {
     e.preventDefault();
})

document.getElementById("img_prev").addEventListener("click", (e) => {
    e.stopPropagation();
})

window.addEventListener("load", () => {
    setTimeout(() => {  
        let noPosts : any = document.getElementById("noPosts");
        firestore = firebase.firestore();
        firestore.collection("posts").where("region", "==", "AS").onSnapshot((querySnapshot) => {
            document.getElementById("loading_posts").innerHTML = "It's quiet for now. <a class='blue' href='post.html'>Wanna make a noise?</a>"
            querySnapshot.docChanges().forEach(change => {
                if (change.type == "added") {
                    fragmentInstance.add(change.doc.data(), querySnapshot);
                    fragmentInstance.updateComments(change.doc.data());
                    fragmentInstance.updateQuery(querySnapshot);
                };
                if (change.type == "modified") {
                    fragmentInstance.update_likes(change.doc.data());
                }
                if (change.type == "deleted") {
                    console.log("Post: ")
                }
            });
            querySnapshot.forEach((doc) => {
                if (!noPosts.className.includes("invisible")) {
                    noPosts.className += " invisible";
                }
                console.log(doc.data()); 
            });
        });
        let dataManager = new DatabaseManager(firestore);
        messaging = firebase.messaging();
        messaging.getToken(
            {vapidKey: "BG8u9E9Qe2OZ6PrSATzwzm5YjJU33_mBoBn1z_J2hMA-LmN1VPspuG23VJTdCUKIPH6GF5k4Fj5eMQqrV9jJhvA"}
        ).then((c) => {
            if (c) {
                console.log(`Notification token: ${c} Please do not give your token to anyone.`)
                firestore.collection("profiles").doc(getCookie("pf_id")).update({notification_token: c});
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        })
    }, 1000);
})
let inputBox : any;
let firestore;

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
     dislikes: any;
     comments: any;
     likes: any;
     id: any;
}

const urlSearchParams : URLSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

interface Renderer {
    canvas: any;
    gl: any;
}

interface ProgramInfo {
    gl: any;
    attribLocations: any;
    uniformLocations: any;
}

class WebGLProgramInfo implements ProgramInfo {
    gl: any;
    attribLocations: any;
    uniformLocations: any;
    shaderProgram: any;
    constructor(gl, program) {
        this.gl = gl;
        this.shaderProgram = program;
        this.attribLocations = {};
        this.attribLocations.vertexPosition = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition')
        this.uniformLocations = {};
        this.uniformLocations.projectionMatrix = this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.uniformLocations.modelViewMatrix =  this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
    }
}

class WebGL implements Renderer {
    canvas: any; 
    gl: any;
    vsource: Promise<string>;
    fsource: Promise<string>;
    vshader: any;
    program: any;
    fshader: any;

    public async loadProgram(name: string): Promise<any> {
        return fetch(`./shader/${name}`).then(data => data.text());
    }
    public loadShader(type, source) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            return null;
          }
          return shader;
    }

    public initializeBuffer(): object {
        const positionBuffer = this.gl.createBuffer();
        const PLANE_COORDINATES: number[] = [
            -1.0, 1.0, 
             1.0, 1.0,
            -1.0, -1.0,
             1.0, -1.0
        ];
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(PLANE_COORDINATES), this.gl.STATIC_DRAW);
        return {position: positionBuffer};
    }
    
    public initializeShaderProgram() {
        this.vshader = this.loadShader(this.gl.VERTEX_SHADER, this.vsource);
        this.fshader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsource);
        if (this.vshader === void 0 || this.fshader === void 0) return null;
        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, this.vshader);
        this.gl.attachShader(shaderProgram, this.fshader);
        this.gl.linkProgram(shaderProgram);
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
        return shaderProgram;
    }
    public drawScene(programInfo: WebGLProgramInfo, buffers) {
        
    }
    constructor(canvas_id: string) {
        this.canvas = document.getElementById(canvas_id);
        this.gl = this.canvas.getContext("webgl");
        this.vsource = this.loadProgram("basic_vertex.vs");
        this.fsource = this.loadProgram("basic_fragment.fs");
        this.program = this.initializeShaderProgram();
        if (this.gl == null) {
            console.log("Your browser does not support WebGL");
        }
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
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

class ImageRenderer extends WebGL {
    url: string;
    size: Vector2<Axis>;
    pos: Vector2<Axis>;
    public image: typeof Image;
    public loadImage(url: string): Promise<typeof Image> {
        const image = new Image();
        return new Promise((resolve, _) => {
            image.src = url;
            image.addEventListener("load", () => {
                setTimeout(resolve, 1000, image);
            })
        })
    }
    
    public drawImage(pos: Vector2<Axis>, size: Vector2<Axis>): Promise<void> {
         this.pos = new Vector2;
         this.size = new Vector2;
         this.pos.setVector(pos);
         this.size.setVector(size);
         return new Promise((res, _) => {
            
         })
    }
    constructor(canvas_id: string) {
        super(canvas_id);
    }
}

class FragmentManager extends FragmentInstance implements FragmentExtension {
    public readonly parent : any;
    public set : any;
    public msg: any;
    public prefix_url: any;
    q: any;
    a: any;

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
         this.a = [];
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
            document.getElementsByClassName("profile_picture_32x32")[i].setAttribute("onclick", `
                 window.location.href = "https://blueprogrammer212.github.io/profile?p=${data.name}&pl=${data.pfp_link.slice(this.prefix_url.length)}&id=0"
            `)
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

    add(data: Data, q) {
        console.log(`%c[System] ` + `%cLoading posts... ${JSON.stringify(data)}`, "color: violet;font-style: bold;", "");
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.template_element_clone.id = data.id;
        this.parent.appendChild(this.template_element_clone);
        this.update_likes(data)
        this.q = q;

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            this.setPosts(data, i);
            this.setButton(data, i);              
        }
        this.setImage(data.pfp_link);
    }
    update_likes(data : Data) {
        console.log(`Processing data to information, <${data.id}>`);
        document.getElementById(data.id).children[0].children[7].innerHTML = data.likes;
    }
    updateQuery(q) {
        this.q = q;
        console.log(`Updated snapshot, ${JSON.stringify(this.q)}`)
    }
    setButton(data, i: number) {
        let like : HTMLCollectionOf<HTMLElement> = document.
            getElementsByClassName("likeBtn") as HTMLCollectionOf<HTMLElement>,
            dislike : HTMLCollectionOf<HTMLElement> = document.
            getElementsByClassName("dislikeBtn") as HTMLCollectionOf<HTMLElement>;
        like[i].onclick = () => { 
            document.getElementsByClassName("dislikeBtn")[i].className = "dislikeBtn";
            if (!document.getElementsByClassName("likeBtn")[i].className.includes("likeBtnPressed")) {
                document.getElementsByClassName("likeBtn")[i].className += " likeBtnPressed";  
                this.q.forEach(docs => {
                    if (docs.data().id == data.id) {
                        firestore.collection("posts").doc(docs.id).update({likes: data.likes+1})
                        data.likes = data.likes + 1;
                    }
                })
            } else {
                document.getElementsByClassName("likeBtn")[i].className = "likeBtn";
                this.q.forEach(docs => {
                    if (docs.data().id == data.id) {
                        firestore.collection("posts").doc(docs.id).update({likes: data.likes - 1});
                        data.likes = data.likes - 1;
                    }
                });
            }
        };
        dislike[i].onclick = () => {
            document.getElementsByClassName("likeBtn")[i].className = "likeBtn";
            if (!document.getElementsByClassName("dislikeBtn")[i].className.includes("dislikeBtnPressed")) {
                document.getElementsByClassName("dislikeBtn")[i].className += " dislikeBtnPressed"
            } else {
                document.getElementsByClassName("dislikeBtn")[i].className = "dislikeBtn";
            }
        };
    }
}

let fragmentInstance = new FragmentManager("template_posts", "../assets/default_pfp_16x16.png");

document.getElementById("img_prev").parentElement.addEventListener("click", () => {
    document.getElementById("img_prev").parentElement.className = "invisible";
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
            if (!noPosts.className.includes("invisible")) {
                noPosts.className += " invisible";
            };
            querySnapshot.docChanges().forEach(change => {
                if (change.type == "added") {
                    fragmentInstance.add(change.doc.data(), querySnapshot);
                };
                if (change.type == "modified") {
                    fragmentInstance.update_likes(change.doc.data());
                }
            });
            querySnapshot.forEach((doc) => {
                console.log(doc.data()); 
                fragmentInstance.updateQuery(querySnapshot);
            });
        });
    }, 5000);
})
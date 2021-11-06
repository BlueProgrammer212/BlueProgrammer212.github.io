let inputBox : any;
let firestore;
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
    public template_element: any;
    constructor(parent_id) {
        this.parent_element = document.getElementsByClassName(parent_id);
        this.template_element = document.getElementById("template_comments_posts");
    } 
    add(id, message, image) {
        if (message.length > 0) {
            this.clone = document.importNode(this.template_element.content, true).children[0];
            this.clone.children[0].children[1].innerHTML = message;
            this.clone.children[0].children[0].src = image;
            let patt = /\((\d+)\)/;
            document.getElementById(id).children[0].children[10].innerHTML = `View Comments (${Number(document.getElementById(id).children[0].children[10].innerHTML.match(patt)[1])+1})`
            document.getElementById(id).children[0].children[11].appendChild(this.clone);
        }
    }
}

//Prevent browser input defaults
let EVENTS : string[] = [
    "click", "keydown", "keypress", "pointerout", "touchmove", "touchstart"
];

if ("addEventListener" in Element.prototype) {
     EVENTS.forEach(elem => window.addEventListener(elem, (e) => {
        e.preventDefault()
     }))
}

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
    program: any;
}

class WebGLProgramInfo implements ProgramInfo {
    gl: any;
    attribLocations: any;
    uniformLocations: any;
    program: any;
    constructor(gl, program) {
        this.attribLocations = {};
        this.attribLocations.vertexPosition = gl.getAttribLocation(program, 'aVertexPosition')
        this.uniformLocations = {};
        this.uniformLocations.projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
        this.uniformLocations.modelViewMatrix =  gl.getUniformLocation(program, 'uModelViewMatrix');
        this.program = program
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
        return fetch(`./shaders/${name}`).then(data => data.text());
    }
    public loadShader(type, source) {
        if (!("createShader" in this.gl)) return;
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

    public initializeBuffer(): object  {
        if (!("createBuffer" in this.gl)) return {};
        const positionBuffer = this.gl.createBuffer();
        const PLANE_COORDINATES: number[] | Array<number> = [
            -1.0, 1.0,
             1.0, 1.0, 
            -1.0, 1.0,
             1.0, -1.0
        ] as Array<number>;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(PLANE_COORDINATES), this.gl.STATIC_DRAW);
        return {position: positionBuffer};
    }
    
    public async initializeShaderProgram() {
        const shaderProgram = this.gl.createProgram();
        let vertexLoadedProgram, fragmentLoadedProgram;
        await Promise.all([this.vsource, this.fsource]).then(([v, f]) => {
            vertexLoadedProgram = v;
            fragmentLoadedProgram = f;
        });
        console.log(vertexLoadedProgram);
        console.log(fragmentLoadedProgram);
        this.vshader = this.loadShader(this.gl.VERTEX_SHADER, vertexLoadedProgram);
        this.fshader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentLoadedProgram);
        this.gl.attachShader(shaderProgram, this.vshader);
        this.gl.attachShader(shaderProgram, this.fshader);
        this.gl.linkProgram(shaderProgram);
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            console.warn(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
        console.log(shaderProgram)
        return shaderProgram;
    }
    public drawScene(programInfo, buffers) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const fov : number = 45 * Math.PI / 180;
        const aspect : number= this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear : number = 0.1;
        const zFar : number = 100.0;

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
        const modelViewMatrix = mat4.create();
        let translation : number[] = [-0.0, 0.0, -6.0];
        mat4.translate(modelViewMatrix, modelViewMatrix, translation); 

        const numComponents : number = 2;
        const type : number = this.gl.FLOAT;
        const normalize : boolean = false;
        const stride : number = 0;
        const offset : number = 0;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
        this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        this.gl.useProgram(programInfo.program);
        this.gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        this.gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        const vertexCount : number = 4;
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
    }
    async drawShape() {
        let prog;
        await this.program.then((a) => {
            prog = a; //Initialize shader program, then define the program local variable.
        });
        this.drawScene(new WebGLProgramInfo(this.gl, prog), this.initializeBuffer());
    }
    constructor(canvas_id: string) {
        this.canvas = document.getElementById(canvas_id);
        this.gl = this.canvas.getContext("webgl");
        this.vsource = this.loadProgram("basic_vertex.vs");
        this.fsource = this.loadProgram("basic_fragment.fs");
        this.program = this.initializeShaderProgram();
        console.log(this.program)
        if (this.gl == null) {
            console.log("Your browser does not support WebGL.");
            return;
        }
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.drawShape();
    }
}

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
let btn_pfp = document.getElementById("ctx_btn_menu");
let profile_img = document.getElementById("pfp_edit_img");
let profile_img_webgl_canvas = document.getElementById("profile_img");

(btn_pfp || document.getElementById("ctx_btn_menu")).addEventListener("click", () => {
    profile_img.className = "blackColorRectBg";
    let ImageRenderInstance = new ImageRenderer("profile_img");
});

profile_img_webgl_canvas.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
})

profile_img.addEventListener("click", () => {
    profile_img.className = "blackColorRectBg invisible"
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
        this.update(i);
        if (this.msg.length == 0 && !data.message.startsWith("/uploadImg[")) {
            this.setMessage(data.message, i);
            this.setTime(data.date_published, i);
            this.setName(data.name, i);
            document.getElementsByClassName("img_upload")[i].setAttribute("class", "invisible img_upload")
        }

        //Send profile data to https://blueprogrammer212.github.io/profile
        document.getElementsByClassName("profile_picture_32x32")[i].setAttribute("onclick", `
             window.location.href = "https://blueprogrammer212.github.io/profile?id=${data.profile_id}"
        `);

        this.update(i);
        if (this.msg.length == 0 && data.message.startsWith("/uploadImg[")) {
            this.setMessage(data.message, i);
            this.setTime(data.date_published, i);
            this.setName(data.name, i);

            console.log("%c[System]" + "%c Loaded image resource successfully", "color: violet;", "color: white");
            this.loadImage(data.message.match(/\[(.*?)\]/)[1], i).then(() => {
                console.log("%c[System]" + "%c Loading resource image... 100%", "color: violet;", "color: white;");
            })
            console.log("%c[System]" + "%c Loaded image resource successfully", "color: violet;", "color: white");
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
        this.update_likes(data);
        this.updateQuery(q);
        this.a.push(data.id);

        for (let i = 0; i < document.getElementsByClassName("postsBox").length; ++i) {
            this.setPosts(data, i);
            this.setButton(data, i); 
            document.getElementsByClassName("pfp_comment")[i].setAttribute("src", getCookie("pfp_url"));
        }
        if (!data.pfp_link.startsWith("https://")) return;
        this.setImage(data.pfp_link);
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
            });
            querySnapshot.forEach((doc) => {
                if (!noPosts.className.includes("invisible")) {
                    noPosts.className += " invisible";
                }
                console.log(doc.data()); 
            });
        });
    }, 1000);
})
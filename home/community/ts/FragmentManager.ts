import * as Interfaces from "./Interfaces.js";
import FragmentInstance from "./FragmentInstance.js";

let inputBox : any;

export default class FragmentManager extends FragmentInstance implements Interfaces.FragmentExtension {
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

    add(data: Interfaces.Data) {
        this.template_element_clone = document.importNode
        (this.template_element.content, true).children[0];
        this.parent.appendChild(this.template_element_clone);
        for (let j = 0; j < document.getElementsByClassName("pfp_name").length; ++j) {
            document.getElementsByClassName("pfp_name")[j].innerHTML = data.name;
        }

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
if ("getElementsByTagName" in document) {
    let images = document.getElementsByTagName("img");
    for (let i = 0; i < images.length; ++i) {
        images[i].addEventListener("contextmenu", () => {
            return false;
        });
        images[i].setAttribute("draggable", "false");
        //Emoji size
        images[i].width = "20"
        images[i].height = "20"
    }
}

class FragmentManager {
    constructor(template) {
        this.template = template;
    }
    appendTo(element) {
        this.emoji = document.importNode(this.template.content, true).children[0];
        element.appendChild(this.emoji)
    }
}

let template = document.getElementById("emoji_heart");
let fragment = new FragmentManager(template);
fragment.appendTo(document.getElementById("p-id-1"))

console.log("Wanna be a developer?")
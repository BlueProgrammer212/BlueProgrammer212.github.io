const regExpression = /|([^|]*)|/g
/*
if (window.location.host !== "blueprogrammer212.github.io") {
    window.location.href = "https://blueprogrammer212.github.io/home"
}
*/

if ("getElementsByTagName" in document) {
    let images = document.getElementsByTagName("img");
    for (let i = 0; i < images.length; ++i) {
        images[i].addEventListener("contextmenu", () => {
            return false;
        });
        images[i].setAttribute("draggable", "false");
        //Emoji size
        if (images[i].classList.contains("emoji")) {
            images[i].width = "20"
            images[i].height = "20"
        }
    }
}

for (let i = 0; i < document.images.length; ++i) {
    document.images[i].oncontextmenu = function() {
        return false;
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
/*
for (let i = 0; i < 3; ++i) {
    fragment.appendTo(document.getElementById("p-id-1"))
}
*/

console.log("Wanna be a developer?")
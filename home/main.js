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

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
        }
    }
}

function hashChangeCallback() {
    if (window.location.hash == "#comments") {
        document.getElementsByTagName("html")[0].setAttribute("w3-include-html", "./comments")
        includeHTML();
    }
}

hashChangeCallback()

window.addEventListener("hashchange", hashChangeCallback)

for (let i = 0; i < document.images.length; ++i) {
    document.images[i].oncontextmenu = function() {
        return false;
    }
}

document.body.oncontextmenu = function() {
    return false; 
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
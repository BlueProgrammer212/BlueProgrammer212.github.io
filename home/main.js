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

console.log("Wanna be a developer?")
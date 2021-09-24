const template = document.getElementById("checkElement");   
let check = document.importNode(template.content, true).children[0];
let checkBox = document.getElementById("checkbox-id-0"),
    proceed = document.getElementById("proceed"),
    message = document.getElementById("invalid");
checkBox.click = null;
checkBox.addEventListener("click", () => {
    if (!checkBox.firstChild) {
        checkBox.appendChild(check)
        checkBox.setAttribute("data-checked", "true")
    } else {
       checkBox.removeChild(check)
       checkBox.setAttribute("data-checked", "false")
    }
})
String.prototype.removeClass = function(className) {
    return this.replace(className, '');
}

proceed.addEventListener("click", () => {
    if (!checkBox.firstChild) {
        message.className = message.className.removeClass("invisible")      
    } else {
        message.className += " invisible" 
    }
})
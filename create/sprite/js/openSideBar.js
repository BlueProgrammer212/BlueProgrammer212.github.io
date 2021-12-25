let sidebar = document.getElementsByClassName("sidebar")[0]; 

setTimeout(() => {
    if (!sidebar) sidebar = document.getElementsByClassName("sidebar")[0];
    sidebar.style.transform = "translateX(-500px)";
    sidebar.style.opacity = 0;
}, 1000); 


function openTab(url) {
    window.open(url)
}

let offline_dialog = document.getElementsByClassName("topnav")[1];

window.onoffline = function() {
    if (offline_dialog.id == "offline") {
        offline_dialog.style.display = "block"
    }
}

window.ononline = function() {
    if (offline_dialog.id == "offline") {
        offline_dialog.style.display = "none"
    }
}
function toggleSideBar() {
    sidebar.style.transform = (sidebar.style.transform===
    "translateX(-500px)" ? "translateX(0px)" : "translateX(-500px)")
    sidebar.style.opacity = (sidebar.style.opacity==0 ? 1 : 0) 
}
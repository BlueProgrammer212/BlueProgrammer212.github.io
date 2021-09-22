let sidebar = document.getElementsByClassName("sidebar")[0]; 
sidebar.style.transform = "translateX(-500px)";
sidebar.style.opacity = 0;

function openTab(url) {
    window.open(url)
}

window.onoffline = function() {
    if (document.getElementsByClassName("topnav")[1].id == "offline") {
        document.getElementsByClassName("topnav")[1].style.display = "block"
    }
}

window.ononline = function() {
    if (document.getElementsByClassName("topnav")[1].id == "offline") {
        document.getElementsByClassName("topnav")[1].style.display = "none"
    }
}
function toggleSideBar() {
    sidebar.style.transform = (sidebar.style.transform===
    "translateX(-500px)" ? "translateX(0px)" : "translateX(-500px)")
    sidebar.style.opacity = (sidebar.style.opacity==0 ? 1 : 0) 
}
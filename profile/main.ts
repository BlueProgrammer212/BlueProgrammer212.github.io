let main_img : any = document.getElementById("img_pfp");
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if ("pl" in params) {
    main_img.src = `https://lh3.googleusercontent.com/a-/${params.pl}`;
}
if ("p" in params) { 
    document.getElementById("name_pfp").innerHTML = params.p;
}

let ids : string[] = ["comment_pagination", "mutual_friends_pagination", "posts_pagination"];

ids.forEach(id => document.getElementById(id).addEventListener("click", () => {
    for (let i = 0; i < document.getElementsByClassName("selected").length; ++i) {
        document.getElementsByClassName("selected")[i].className = "";
    }
    document.getElementById(id).className = "selected";
}))
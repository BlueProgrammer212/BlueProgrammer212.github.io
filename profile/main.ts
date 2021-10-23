let main_img : any = document.getElementById("img_pfp");
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if ("pl" in params) {
    main_img.src = params.pl;
}
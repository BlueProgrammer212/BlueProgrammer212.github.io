let main_img : any = document.getElementById("img_pfp");
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

class FirebaseSetup {
    protected firestore: any;
    constructor(firestore : any) {
        this.firestore = firestore;
    }
}

async function pendingRedirect(url): Promise<string>  {
    this.url = url;
    return new Promise((resolve, _) => {
        setTimeout(resolve, 500, this.url);
    })
}

class User extends FirebaseSetup {
    protected readonly errorPage: String;
    constructor(firestore) {
        super(firestore);
        this.errorPage = "https://blueprogrammer212.github.io/profile/404?userNotFound=true&onload=true";
        if ("id" in params && "pl" in params && "p" in params) {
            console.log(`[System] Searching people with ProfileID, <${params.id}>`);
        } else {
            console.log(`[System] The given parameters in the search url was invalid.`);
            console.log(`[Redirect] 404 Page: ${this.errorPage}`);
            pendingRedirect(this.errorPage).then((lk : string) => {
                window.location.href = lk;
            }).catch((err : Error) => {
                console.log(`[System] Failed to redirect to destination. Reason: ${err}`);
            })
        }
    }
}

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
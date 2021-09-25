let redirect = document.getElementById("redirect"),
    second = 5; 
console.log("Yes, I'm working")

setInterval(() => {
    second -= 1;
    if (second > 0) {
    redirect.innerHTML = `Redirecting back to homepage in ${second}s.`
    } else if (second <= 0) {
    window.location.hash = "";
    window.location.reload();
    }
}, 1000)
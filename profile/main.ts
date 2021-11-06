if (
    "addEventListener" in Element.prototype
) {
    window.addEventListener("comment", () => {
        console.log("[System] Loading new comment...");
    })
}
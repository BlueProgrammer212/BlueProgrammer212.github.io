if (
    "addEventListener" in Element.prototype
) {
    window.addEventListener("comment", () => {
        console.log("[System] Loading new comment...");
    })
}

class Role {
    public userId: string;
    constructor(userId) {
        this.userId = userId
    }
}

class RoleManager extends Role {
    public roleParent: any;
    public templateId: string;
    public templateElement: any;
    constructor(userId : string, roleParentContainer, templateId : string) {
        super(userId); 
        this.roleParent = roleParentContainer;
        this.templateId = templateId;
        this.templateElement = document.getElementById(this.templateId);
    }
    public add(data) {
        const parsedData = JSON.parse(data);
        const clone = document.importNode(this.templateElement.content, true).children[0];
        this.roleParent.appendChild(clone);
    }
}
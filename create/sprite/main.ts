declare let PIXI: any;

class Renderer {

    gameCanvas: any;
    stage: any;
    renderer: any;
    gameWidth: number;
    gameHeight: number;

    constructor() {
        this.gameCanvas = null;
        this.stage = null;
        this.renderer = null;
        this.gameWidth = null;
        this.gameHeight = null;
    }

    printText(str : string, config = {font:"16px Arial", fill:"white", align:"center"}): void {
        const example_text = new PIXI.Text(str, config);
        this.stage.addChild(example_text)
    }

    init(cid : string, width = 800, height = 800): void {
        this.gameCanvas = document.getElementById(cid);
        this.stage = new PIXI.Stage(0x000000);
        this.gameWidth = width;
        this.gameHeight = height;
        this.renderer = PIXI.autoDetectRenderer(this.gameWidth, this.gameHeight, this.gameCanvas);
    }
  
};

window.onload = function() {
    let renderer = new Renderer();
    renderer.init("main_canvas", 800, 800);
}
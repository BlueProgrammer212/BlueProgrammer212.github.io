declare let PIXI: any;

var gameCanvas;
var stage, renderer;
var gameWidth, gameHeight;

    gameCanvas = document.getElementById("main_canvas");

    gameWidth = 800;
    gameHeight = 800;

var example_text = new PIXI.Text("Example text!", {font:"16px Arial", fill:"white", align:"center"});
example_text.position.y = 100;
example_text.position.x = 100;


stage = new PIXI.Stage(0x000000);
renderer = PIXI.autoDetectRenderer(gameWidth, gameHeight, gameCanvas);
stage.addChild(example_text);
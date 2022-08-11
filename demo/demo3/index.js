
window.onload = () => {
    init()
}
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
function init() {
    canvas = document.getElementById("canvas");
    anim_container = document.getElementById("animation_container");
    dom_overlay_container = document.getElementById("dom_overlay_container");
    var comp = AdobeAn.getComposition("3F6F21A0668CAB4C8A60C6DACABBBDFE");
    var lib = comp.getLibrary();
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", function (evt) { handleFileLoad(evt, comp) });
    loader.addEventListener("complete", function (evt) { handleComplete(evt, comp) });
    var lib = comp.getLibrary();
    loader.loadManifest(lib.properties.manifest);
}
function handleFileLoad(evt, comp) {
    var images = comp.getImages();
    if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }
}
function handleComplete(evt, comp) {
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    var lib = comp.getLibrary();
    var ss = comp.getSpriteSheet();
    var queue = evt.target;
    var ssMetadata = lib.ssMetadata;
    for (i = 0; i < ssMetadata.length; i++) {
        ss[ssMetadata[i].name] = new createjs.SpriteSheet({ "images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames })
    }
    exportRoot = new lib.jump();
    stage = new lib.Stage(canvas);
    //Registers the "tick" event listener.
    fnStartAnimation = function () {
        stage.addChild(exportRoot);



        let pillarX = 575  // 柱子默认的x
        //添加鸟
        var bird = new lib.bird();
        bird.gotoAndPlay('yelloFly')
        bird.x = 135.95
        bird.y = 256.5
        exportRoot.addChild(bird)



        // 添加柱子
        let pillarInterval = setInterval(() => {
            var greenPillarUp = new lib.greenpillarUp();
            var greenPillarDown = new lib.greenpillarDown();
            greenPillarUp.x = pillarX
            greenPillarDown.x = pillarX
            greenPillarUp.y = Math.floor(Math.random() * ((-58.95 + 246.05 + 1) - 246.05))
            greenPillarDown.y = Math.floor(Math.random() * ((423 - 261.05 + 1) + 261.05))
            exportRoot.addChild(greenPillarUp)
            exportRoot.addChild(greenPillarDown)
        }, 500)





        createjs.Ticker.framerate = lib.properties.fps;
        createjs.Ticker.addEventListener("tick", stage);
    }
    //Code to support hidpi screens and responsive scaling.
    AdobeAn.makeResponsive(false, 'both', false, 1, [canvas, anim_container, dom_overlay_container]);
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
}
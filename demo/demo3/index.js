
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
        var bird = new lib.bird()
        bird.gotoAndPlay('yelloFly')
        bird.x = 135.95
        bird.y = 256.5
        pillarSpeed = 2000
        num = 0
        iskeyDown = false
        exportRoot.addChild(bird)
        // 添加柱子
        let pillarInterval = setInterval(() => {
            var greenPillarUp = new lib.greenpillarUp();
            var greenPillarDown = new lib.greenpillarDown();
            greenPillarUp.x = pillarX
            greenPillarDown.x = pillarX
            greenPillarDown.isFirst = true
            greenPillarUp.y = Math.floor(Math.random() * (-136.95 + 246.05 + 1) - 246.05)
            greenPillarDown.y = Math.floor(Math.random() * (437 - 297 + 1) + 297)
            exportRoot.addChild(greenPillarUp)
            exportRoot.addChild(greenPillarDown)
            createjs.Tween.get(greenPillarUp).to({ x: -50 }, pillarSpeed).call(() => {
                exportRoot.removeChild(greenPillarUp)
            }).addEventListener('change', () => {

                let hit = ndgmr.checkRectCollision(bird, greenPillarUp)
                if (hit) {
                    bird.gotoAndPlay('die')
                    this.clearInterval(pillarInterval)
                }
            })
            createjs.Tween.get(greenPillarDown).to({ x: -50 }, pillarSpeed).call(() => {
                exportRoot.removeChild(greenPillarDown)
            }).addEventListener('change', () => {

           if(greenPillarDown.x<bird.x&&greenPillarDown.isFirst){
            num++
            document.querySelector('.num').innerHTML= num
            greenPillarDown.isFirst =false
           }
                let hit = ndgmr.checkRectCollision(bird, greenPillarDown)
                if (hit) {
                    bird.gotoAndPlay('die')
                    this.clearInterval(pillarInterval)

                }
            })
        }, 800)
        // function getpillarY() {
        //  let   greenPillarUp = Math.floor(Math.random() * (-8.95 + 246.05 + 1) - 246.05)
        //   let  greenPillarDown = Math.floor(Math.random() * (370 - 261.05 + 1) + 261.05)
        //     console.log(greenPillarDown + greenPillarUp)
        //     if (greenPillarDown.y + greenPillarUp.y > 50) {
        //         let a = [greenPillarUp, greenPillarDown]
        //         return a
        //     }
        //     else {
        //         getpillarY()
        //     }
        // }
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 38) {
                iskeyDown = true;
            }
        })
        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 38) {
                iskeyDown = false;
            }
        })
        createjs.Ticker.addEventListener('tick', () => {

            if (!iskeyDown) {
                bird.y += 5
            }
            else {
                bird.y -= 10
            }
        })




        createjs.Ticker.framerate = lib.properties.fps;
        createjs.Ticker.addEventListener("tick", stage);
    }
    //Code to support hidpi screens and responsive scaling.
    AdobeAn.makeResponsive(false, 'both', false, 1, [canvas, anim_container, dom_overlay_container]);
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
}
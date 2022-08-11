var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

window.onload = () => {
	init()
}

function init() {
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp = AdobeAn.getComposition("25997354CF58BC408CB24C3778BA042A");
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
	exportRoot = new lib.eatAll();
	stage = new lib.Stage(canvas);
	stage.addChild(exportRoot);

	//Registers the "tick" event listener.
	//音乐

	const SOUND = [
		{ src: './audio/bg.mp3', id: 'bg' },
		{ src: './audio/boom.mp3', id: 'boom' },
		{ src: './audio/coin.mp3', id: 'coin' },
		{ src: './audio/play.mp3', id: 'play' },
	]
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.on("fileload", loadHandler);
	createjs.Sound.registerSounds(SOUND, "./");
	let loadNum = 0;
	function loadHandler(event) {
		loadNum++
		if (loadNum == SOUND.length) {
			console.log('加载完毕')
		}
		// This is fired for each sound that is registered.
		// var instance = createjs.Sound.play("sound");  // play using id.  Could also use full sourcepath or event.src.
		// instance.on("complete", this.handleComplete, this);
		// instance.volume = 0.5;
	}
		const SPEED = 10;  //速度
		let direction = 1;  // 方向
		let isKeyDown = false; // 按键状态
		let coinSpeed = 3000  // 金币掉落速度
		let coinShow = 1000  // 金币出现速度
		let num = 0  // 分数
		let hp = 10  // 生命
		let isJump = false  // 是否在跳
		// 将人物添加到舞台
		var role = new lib.role();
		role.x = 356.85;
		role.y = 334;
		//金币
		exportRoot.addChild(role)



		let coinInterval = setInterval(() => {
			var coin = new lib.coin();
			coin.x = Math.floor(Math.random() * 665)
			coin.y = -50
			exportRoot.addChildAt(coin, 0)
			createjs.Tween.get(coin).to({ y: 380 }, coinSpeed).call(() => {
				exportRoot.removeChild(coin)
				hp--
				document.querySelector('.hp').innerHTML = `${hp}`

			}).addEventListener('change', () => {
				let hit = ndgmr.checkRectCollision(coin, role)
				if (hit) {
					exportRoot.removeChild(coin)
					createjs.Tween.removeTweens(coin)
					num++
					document.querySelector('.num').innerHTML = num
					createjs.Sound.play("coin")
				}
			})

		}, coinShow);



	fnStartAnimation = function () {
	

		window.addEventListener("keydown", keyDown)
		window.addEventListener("keyup", keyUp)
		function keyDown(e) {
			console.log(e)
			if (isKeyDown) return
			if (e.keyCode === 37 || e.keyCode === 39) {
				isKeyDown = true;
				direction = e.keyCode === 37 ? -1 : 1
				role.gotoAndPlay('run')
			}
			if (e.keyCode === 32 && !isJump) {
				isJump = true
				let up = setInterval(() => {
					role.y -= 5
					if (role.y <= 200) {
						clearInterval(up);
						let down = setInterval(() => {
							role.y += 5
							if (role.y >= 334) {
								role.y = 334
								isJump = false
								clearInterval(down)
							}
						}, 10);

					}
				}, 10);

			}
		}
		function keyUp(e) {
			isKeyDown = false;
			if (e.keyCode === 37 || e.keyCode == 39) {
				role.gotoAndPlay('stop');

			}
		}

		createjs.Ticker.addEventListener('tick', tickFn)
		function tickFn() {
			if (hp <= 0) {
				createjs.Sound.play('boom')
				role.gotoAndPlay('death')
				createjs.Ticker.removeEventListener('tick', tickFn)
				clearInterval(coinInterval)
				window.removeEventListener("keydown", keyDown)
				window.removeEventListener("keyup", keyUp)
			}

			if (!isKeyDown) return
			role.scaleX = direction
			console.log(role.x)

			if (role.x <= 26 || role.x >= 667) {
				role.x = role.x <= 26 ? 27 : 666
				return

			} else {
				role.x += SPEED * direction
			}
		}



		createjs.Ticker.framerate = lib.properties.fps;
		createjs.Ticker.addEventListener("tick", stage);
	}
	//Code to support hidpi screens and responsive scaling.
	AdobeAn.makeResponsive(false, 'both', false, 1, [canvas, anim_container, dom_overlay_container]);
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
}
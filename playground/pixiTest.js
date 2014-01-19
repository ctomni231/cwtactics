var viewWidth = 800;
var viewHeight = 600;

var renderer = PIXI.autoDetectRenderer(viewWidth, viewHeight);

renderer.view.className = "rendererView";

document.body.appendChild(renderer.view);

var stage = new PIXI.Stage(0xFFFFFF);

// create an array of assets to load
var assetsToLoader = ["cwt.json"];

// create a new loader
loader = new PIXI.AssetLoader(assetsToLoader);

var xunit;

// use callback
loader.onComplete = onAssetsLoaded;

//begin load
loader.load();

function onAssetsLoaded() {

	var tile_a = PIXI.Sprite.fromFrame("CWT_PLIN.png");
	var tile_b = PIXI.Sprite.fromFrame("CWT_FRST.png");
	var unit_a = PIXI.Sprite.fromFrame("CWT_AAIR.png");
	var unit_b = PIXI.Sprite.fromFrame("CWT_INFT.png");

	for (var x = 0; x < 40; x++) {
		for (var y = 0; y < 30; y++) {
			var tile = PIXI.Sprite.fromFrame("CWT_PLIN.png");
			tile.position.y = -16 + (y * 16);
			tile.position.x = (x * 16);
			stage.addChild(tile);
		}
	}

	for (var x = 0; x < 40; x++) {
		for (var y = 0; y < 30; y++) {
			var unit = new PIXI.MovieClip([
				PIXI.Texture.fromFrame("CWT_INFT1.png"),
				PIXI.Texture.fromFrame("CWT_INFT2.png"),
				PIXI.Texture.fromFrame("CWT_INFT3.png")
			]);

			unit.position.y = (y * 16);
			unit.position.x = (x * 16);
			unit.animationSpeed = 0.05;
			unit.gotoAndPlay(Math.random() * 27);

			stage.addChild(unit)
		}
	}

	xunit = new PIXI.MovieClip([
		PIXI.Texture.fromFrame("CWT_INFT1.png"),
		PIXI.Texture.fromFrame("CWT_INFT2.png"),
		PIXI.Texture.fromFrame("CWT_INFT3.png")
	]);

	xunit.position.y = (31*16);
	xunit.position.x = (0);
	xunit.animationSpeed = 0.05;
	xunit.gotoAndPlay(Math.random() * 27);

	stage.addChild(xunit)
	requestAnimationFrame(animate);
}

function animate() {

	xunit.position.x += 4;
	if( xunit.position.x >= 400 ) xunit.position.x = 0;

	// time to render the state!
	renderer.render(stage);

	// request another animation frame..
	requestAnimationFrame(animate);
}
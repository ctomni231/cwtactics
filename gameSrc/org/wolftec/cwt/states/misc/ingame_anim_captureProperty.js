"use strict";

var COOL_DOWN_PER_TICK = 100;

var BAR_HEIGHT = 20;
var BAR_WIDTH = 80;
var BAR_PADDDING = 5;

var BOX_WIDTH = 20 + BAR_WIDTH;
var BOX_HEIGHT = 20 * BOX_HEIGHT + 19 * BAR_PADDDING + 20;

var constants = require("../constants");

var coolDown;
var curP;
var targetP;
var screenX;
var screenY;

exports.state = {

	id: "ANIMATION_CAPTURE_PROPERTY",

	nextState: "INGAME_IDLE",

	states: 1,

	enter: function(x, y, curPoints, nextPoints) {
		// TODO: move start position if the capture box would go out of bounds

		screenX = x - renderer.screenOffsetX;
		screenY = y - renderer.screenOffsetY;
		curP = curPoints;
		targetP = nextPoints;
	},

	update: function(delta, lastInput, state) {
		coolDown -= delta;
		if (coolDown <= 0) {
			coolDown = COOL_DOWN_PER_TICK;
			curP += 1;
		}

		return (curP === targetP+1);
	},

	render: function(delta) {
		renderer.layerUI.clear();
		var ctx = renderer.layerUI.getContext();
		var oldStyle = ctx.fillStyle;

		// render 
		ctx.fillStyle = "black";
		ctx.fillRect(
			screenX * constants.TILE_BASE,
			screenY * constants.TILE_BASE,
			BAR_WIDTH,
			BOX_HEIGHT
		);

		// render bars
		ctx.fillStyle = "red";
		for (var i = 0; i < curP; i++) {
			ctx.fillRect(
				screenX * constants.TILE_BASE, 
				(screenY * constants.TILE_BASE) + BOX_HEIGHT - 10 - (i * (BAR_HEIGHT + BAR_PADDDING)),
				BAR_WIDTH,
				BAR_HEIGHT
			);
		}

		ctx.fillStyle = oldStyle;
	}
};
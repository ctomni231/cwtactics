"use strict";

var FADE_TIME = 250;

var renderer = require("../renderer");

var fadeLevel;

exports.state = {

	id: "ANIMATION_CHANGE_WEATHER",

	nextState: "INGAME_IDLE",

	states: 2,

	enter: function() {
		fadeLevel = 0;
	},

	update: function(delta, lastInput, state) {
		switch (state) {

			// fade in
			case 0:
				fadeLevel += (delta / FADE_TIME);
				if (fadeLevel > 1) fadeLevel = 1;
				return (fadeLevel === 1);

				// fade out
			case 1:
				fadeLevel -= (delta / FADE_TIME);
				if (fadeLevel < 0) fadeLevel = 0;
				return (fadeLevel === 0);

		}
	},

	render: function(delta) {
		renderer.layerUI.clear();
		var ctx = renderer.layerUI.getContext();

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);
	}
};
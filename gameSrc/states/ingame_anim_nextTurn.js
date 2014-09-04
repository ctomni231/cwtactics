"use strict";

var constants = require("../constants");
var renderer = require("../renderer");
var model = require("../model");

var MIDDLE_WAIT_TIME = 1500;
var MOVE_PER_MS = parseInt((3 * constants.TILE_BASE) / 1000, 10);

if (MOVE_PER_MS === 0) MOVE_PER_MS = 1;

var text;
var curX;
var curY;
var middleX;
var waited;
var inMiddle;

exports.state = {
	id: "ANIMATION_NEXT_TURN",
	nextState: "INGAME_IDLE",

	enter: function() {
		text = "Day " + model.day;
		curY = 0;
		curX = 0;
		waited = 0;
		inMiddle = false;

		var ctx = renderer.layerUI.getContext();
		middleX = renderer.screenWidth - parseInt(ctx.measureText(text).width / 2, 10);

		// TODO play music
		//if (controller.features_client.audioMusic) {
		//	var commanders = model.co_data[model.round_turnOwner].coA;
		//	controller.coMusic_playCoMusic((commanders) ? commanders.music : null);
		//}
	},

	update: [

		// FLY IN
		function(delta, lastInput) {
			curX += (MOVE_PER_MS * delta);
			console.log("fly in x:"+curX);
			return (curX >= middleX);
		},

		// WAIT IN THE MIDDLE
		function(delta, lastInput) {
			waited += delta;

			// go further when you waited a but in the middle of the screen
			return (waited >= MIDDLE_WAIT_TIME);
		},

		// FLY OUT
		function(delta, lastInput) {
			curX += (MOVE_PER_MS * delta);
			console.log("fly out x:"+curX);
			return (curX > renderer.screenWidth);
		}
	],

	render: function() {
		renderer.layerUI.clear();
		var ctx = renderer.layerUI.getContext();

		ctx.fillStyle = "black";
		ctx.font = "32pt " + constants.GAME_FONT;
		ctx.fillText(text, curX, curY);
	}
};
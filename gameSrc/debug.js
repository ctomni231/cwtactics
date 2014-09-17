import model from "./model";

var action = null;
var x = 0;
var y = 0;
var tile = null;

/**
 *
 * 
 * @param  {string} currentAction [description]
 */
exports.updateActionInformation = function (currentAction) {
	action = currentAction;
};

/**
 * 
 * @param  {number} x [description]
 * @param  {number} y [description]
 */
exports.updateCursorInformation = function (x, y) {
	tile = model.mapData[x][y].type.ID;
	
};

/**
 * 
 * @param  {[type]} layer [description]
 */
exports.renderInformation = function (layer) {
	var ctx = layer.getContext(0);

	ctx.fillText("Pos ("+x+","+y+")", 0, 0);
	ctx.fillText("Doing => "+action, 0, 0);

	layer.renderLayer(0);
};
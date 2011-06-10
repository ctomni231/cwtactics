meow.defineModule({
	name : "CWT_MapObjects",
	req : null,
	body : function(){

		var Tile = function()
		{

		};

		var Unit = function()
		{

		};

		// interhits from tileMap
		Tile.prototype = MapObject.prototype;
		Unit.prototype = MapObject.prototype;
	}
});
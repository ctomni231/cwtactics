meow.defineModule({
	name : "CWT_Cards",
	req : null,
	body : function(){

		var TransportCard = function( maxLoads ){
			var loaded = new meow.Array();
			var max = maxLoads;

			this.putLoad = function(){};
			this.popLoad = function(){};
			this.canLoad = function(){};
		};

		/**
		 * BattleCard holds all necessary values for a possible battle between
		 * two units.
		 * 
		 * @constructor
		 */
		var BattleCard = function(){
			var attacker = null;
			var defender = null;
			var attackDmg = 0;
			var counterDmg = 0;

		};

	}
});
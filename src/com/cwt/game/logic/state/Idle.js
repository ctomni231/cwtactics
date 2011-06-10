(function(){

	/**
	 * Idle state represents the normal view on the map without doing a special
	 * action. It reqresents at the name already shows, the idle.
	 */
	var idleSt = {
		
		action : function(){
			// if unit, move
			// else if factory, build
			// else menu
		},
		
		cancel : function(){
			// if unit, show range
		}
	};

	cwt.stateCtr.addState( idleSt );

})();
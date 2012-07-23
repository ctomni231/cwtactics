/**
 * Actions contains only atomic functions. All actions will all time shared with other clients
 * if the game runs in a network context.
 */
cwt.action = {
	
	// holds the actions
	_actions: {},
	
	// holds the conditions
	_conds: {},
	
	/**
	 * Registers a game action in the action context.
	 */
	register: function( aKey, actionFn, conditionFn ){
		if( this._actions.hasOwnProperty(aKey) ){
			throw Error( aKey+" is already registered in the game action context" );
		}
		
		// register action function
		this._actions[ aKey ] = actionFn;
		
		if( conditionFn !== undefined ){
			// CONDITION ACTIVATES THE ACTION ONLY IN A CUSTOM SITUATION
			this._conds[ aKey ] = conditionFn; }
		else {
			// NO CONDITION MEANS ALL TIME ACTION
			this._conds[ aKey ] = cwt.util.trueReturner; }
	}
};
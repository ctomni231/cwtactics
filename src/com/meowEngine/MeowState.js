meow.sys.reqModule("MeowAssert")
meow.sys.reqModule("MeowDebug")
meow.sys.reqModule("MeowClass")
meow.sys.reqModule("MeowEntity")

var chk = meow.assert
var out = meow.debug

/**
 * MeowEngine's state controller.
 *
 * @author Tapsi
 * @since 26.05.2011
 * @namespace
 */
meow.state =
/** @lends meow.state# */
{

	/** 
	 * Represents the active state
	 *
	 * @private 
	 */
	activeState : null,

	/**
	 * Holds all connected states
	 *
	 * @private 
	 */
	stateMap : {},

	/**
	 * Invokes an updating step in the active state
	 */
	update : function()
	{
		out.info("Invoking active state algorithm")

		this.activeState.update();
	},

	/**
	 * Enters an unendless game loop.
	 */
	gameLoop : function()
	{
		out.info("Entering game loop")

		chk.isTrue( activeState != null )

		// game loop
		while( true )
		{
			this.update();

			sys.sleep( 125 );
		}
	},

	/**
	 * Adds a state instance to the state controller.
	 */
	add : function( stateName , state )
	{
		chk.notEmpty( stateName )
		notNull( func)
		out.info( String.concat("State \"",stateName,"\" pushed to state controller") )
		chk.notIn( stateName , stateMap )

		if(!( state instanceof this.State ))
			throw "Invalid state object! Must be instance of meow.state.BaseState..."

		this.stateMap[ stateName ] = func;
	},

	/**
	 * Removes a state instance from the state controller.
	 */
	remove : function( stateName )
	{
		chk.notEmpty( stateName )
		out.info( String.concat("State \"",stateName,"\" removed from state controller") )
		chk.isIn( stateName , stateMap )

		if( this.activeState == stateName )
			throw "IsActiveStateException"
		else
			delete this.stateMap[ stateName ];
	},

	/**
	 * Sets the active state.
	 */
	setState : function( stateName )
	{
		chk.notEmpty( stateName )
		chk.isIn( stateName , stateMap )
		out.info( String.concat("State \"",stateName,"\" is now the active state") )

		if( this.activeState != null )
			this.activeState.exit()

		this.activeState = this.stateMap[ stateName ];

		this.activeState.enter()
	},

	/**
	 * Base state class, used by the state manager.
	 *
	 * @example
	 * // use BaseState as base for own states
	 * var myState = new meow.state.State()
	 *
	 * myState.update = function(){
	 *	 out.info( "myState updates it's data" )
	 * }
	 *
	 * myState.enter = function(){ out.info("enters myState") }
	 *
	 * @class
	 * @name State
	 * @memberOf meow.state
	 * @extends meow.BaseEntity
	 */
	State : meow.entity.BaseEntity.$extend(
	/** @lends meow.state.State# */
	{
		/**
		 * Called if the state will be set by setState function in the state
		 * controller.
		 *
		 * @default meow.EMPTY_FUNCTION
		 */
		enter : meow.EMPTY_FUNCTION,

		/**
		 * Called if the state will be exited by setState function in the state
		 * controller.
		 *
		 * @default meow.EMPTY_FUNCTION
		 */
		exit : meow.EMPTY_FUNCTION
	})
}

if( !MEOW_NOCONFLICT )
	state = meow.state
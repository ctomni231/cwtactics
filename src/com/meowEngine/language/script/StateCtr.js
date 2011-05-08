/**
 * MeowEngine's state controller
 *
 * @author Tapsi
 * @lastModified 08.05.2011
 * @lastUpdates added debug logging expressions
 * @todo add left debug expressions
 */
meow.stateCtr =
{

	/** @private */
	activeState : null,

	/** @private */
	stateMap : {},

	update : function()
	{
		$: out.info("Invoking active state algorithm")

		this.activeState();
	},

	gameLoop : function()
	{
		$: out.info("Entering game loop")

		// game loop
		while( true )
		{
			this.activeState();

			sys.sleep( 125 );
		}
	},

	pushState : function( stateName , func )
	{
		$: notEmpty( stateName ); notNull( func)
		$: out.info( String.concat("State '",stateName,"' pushed to state controller") )
		$: notIn( stateName , stateMap )

		this.stateMap[ stateName ] = func;
	},

	removeState : function( stateName )
	{
		$: notEmpty( stateName )
		$: out.info( String.concat("State '",stateName,"' removed from state controller") )
		$: isIn( stateName , stateMap )

		delete this.stateMap[ stateName ];
	},

	setState : function( stateName )
	{
		$: notEmpty( stateName )
		$: isIn( stateName , stateMap )
		$: out.info( String.concat("State '",stateName,"' is now the active state") )

		this.activeState = this.stateMap[ stateName ];
	}
};
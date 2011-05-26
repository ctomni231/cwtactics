meow.sys.reqModule("MeowJSON")

var assert = meow.assert
var devider = ".#."

/**
 * MeowEngine network module contains functions to provide a networking 
 * ability for the MeowEngine model.
 *
 * @author Tapsi
 * @version 11.05.2011
 * @namespace
 */
meow.network = /** @lends meow.network# */
{
	/**
	 * Networking module
	 *
	 * @example
	 * Structure:
	 *  connectTo( String server ) void
	 *  pushMessage( String message ) void
	 *
	 * Invokes:
	 *  // will be invoked if a message is incoming
	 *  onNetworkMsg( String message )
	 */
	netModule : null,
	
	connect : function( server )
	{
		this.netModule.connectTo( server )
	},
	
	/**
	 * Invokes a function over all connected network clients.
	 *
	 * @param {String} namespace exact path of the function object
	 * @param {Array} args arguments of the function
	 */
	syncInvoke : function( namespace , args )
	{
		this.netModule.pushMessage( "SINV_"
								+funcName
								+devider
								+(meow.JSON.stringify(args)))
	},

	/**
	 * Places an object directly on all clients.
	 *
	 * @param {String} namespace exact path of the function object
	 * @param {Object} value arguments of the function
	 */
	syncObject : function( namespace , value )
	{
		this.netModule.pushMessage( "SOBJ_"
								+namespace
								+devider
								+(meow.JSON.stringify(value)))
	},

	/**
	 * Processes an incoming message from the network stack.
	 *
	 * @example
	 * Format is:
	 * OPCODE (_) NAMESPACE (devider) VALUE
	 *
	 * OpCode
	 * =======
	 * length of 4 characters
	 *	SINV - invokes a local function
	 *	SOBJ - sets a json compatible object locally
	 *
	 * Namespace
	 * =========
	 * contains the exact path of the object in the internal data tree
	 *
	 * Value
	 * =====
	 * contains a string in the json format, that will be placed in the target 
	 * or used as arguments object
	 *
	 * Devider
	 * =======
	 * .#.
	 */
	incomingMsg : function( msg )
	{
		var code = msg.slice(0,4)
		var data = msg.slice(5,msg.length)
		var left ,right ,obj
		switch( code )
		{
			case 'SINV' :
				data = data.split(devider)
				left = data[0]
				right = data[1]
				obj = meow.JSON.parse(right)

				// only on namespaces yet
				meow.sys.getObjectValue(left).apply(null, obj)
				break

			case 'SOBJ' :

				data = data.split(devider)
				left = data[0]
				right = data[1]

				meow.sys.setObjectValue(left,
									meow.JSON.parse( right ) )
				break
		}
	}
}

// connect meow network listener method to global message event
getGlobal().onNetworkMsg = function( msg ){meow.network.incomingMsg( msg )}

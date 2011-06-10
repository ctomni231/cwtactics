(function(){

	var allReg = /./;
	var registered = false;

	/**
	 * Places a global tracing around every method.
	 *
	 * @param {RegExp} regExp the reg expression for the methods, that will be
	 *						  traced. If null, all methods of the global context
	 *						  will be traced.
	 */
	meow.registerGlobalTracer = function( regExp )
	{
		if( registered ) return;

		regExp = ( regExp == null )? allReg : regExp

		meow.aop.around( { target: meow.sys.getGlobal() , method: regExp } ,
			function(){
				meow.out.info("Executing "+invocation.method+" function")
				return invocation.proceed()
			}
		)
	};

	/**
	 * Removes the global tracer, if registered.
	 */
	meow.unregisterGlobalTracer = function(){
		if( !registered ) return;

		registered = false;
	};
})();
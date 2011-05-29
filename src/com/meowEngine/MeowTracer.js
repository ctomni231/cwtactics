var allReg = /./

meow.debug.placeGlobalTracer = function( regExp )
{
	regExp = ( regExp == null )? allReg : regExp

	meow.aop.around( { target: meow.sys.getGlobal() , method: regExp } ,
		function(){
			meow.out.info("Executing "+invocation.method+" function")
			return invocation.proceed()
		}
	)
}
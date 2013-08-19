controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent);

controller.screenStateMachine.structure.LOAD.section = "cwt_load_screen";

controller.screenStateMachine.structure.LOAD.enterState = function(){
	jWorkflow.order()
	
	// **1.A** check environment
	.andThen(controller.calculateEnvironmentFeatures)
	
	// **1.B** show message when system isn't supported
	.andThen(function(p,b){
		if( controller.clientFeatures.supported ){
			b.take();
			if( confirm("Your system isn't supported by CW:T. Try to run it?") ) b.pass();
		}
	})
	
	// **2.** load correct storage system
	.andThen(controller.loadStorageController)
	
	// **3.** check environment
	.andThen(function( err, baton ){
		if( err ) return err;
		baton.take();
		
		controller.storage.get("resetDataAtStart",function( obj ){
			var  wipeOut = (obj !== null && obj.value);
			
			if( !wipeOut ) wipeOut = getQueryParams(document.location.search).wipeoutMod === "1";
			if(  wipeOut ){
				if( constants.DEBUG ) util.log("wipe out cached data");
				
				// NUKE STORAGE
				controller.storage.clear( function(){
					baton.pass(false); 
				});
			}
			else baton.pass(false);
		});
		
	})
	
	// **4.** check environment
	.andThen(controller.loadModification)
	
	// **5.** check environment
	.andThen(controller.loadMaps)
	
	// **6.** check environment
	.andThen(controller.loadImages)
	
	// **7.** check environment
	.andThen(controller.cutImages)
	
	// **8.** check environment
	.andThen(controller.colorizeImages)
	
	// **9.** check environment
	.andThen(controller.loadSoundFiles)
	
	// **10.** check environment
	.andThen(controller.loadInputDevices)
	
	// **11.** start client 
	.andThen(function(){ 
		controller.screenStateMachine.event("complete"); 
	})
	
	.start(function(p){
		if( p ) model.criticalError( constants.error.UNKNOWN, constants.error.UNKNOWN );
	});
};

controller.screenStateMachine.structure.LOAD.complete = function(){
	return "MOBILE";
};

controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine;
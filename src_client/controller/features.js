// Contains all features of the web client. If the value of a feature is `true`, then it will
// be supported by the current active environment. If the value is `false`, then it isn't
// supported.
//
controller.features_client = {
	audioSFX: 	false,
	audioMusic: false,
	gamePad: 	  false,
	keyboard:	  false,
	mouse:		  false,
	touch:		  false,
	supported:  false,
  scaledImg:  false
};

// Calculates the available features of the active environment.
//
controller.features_analyseClient = function(){
	
	// Mobile Browser
	if( Browser.mobile ){
		
		// ios has *AA* support
		if( Browser.ios ){
			if( Browser.version >= 5 ) controller.features_client.supported = true;
			if( Browser.version >= 6 ) controller.features_client.audioSFX = true;
		} 
		else if( Browser.android ){
			controller.features_client.supported = true;
		}
			
		controller.features_client.touch = true;
	}
	// Desktop Browser
	else{
		
		// chrome has *AAA* support
		if( Browser.chrome || Browser.safari){
			controller.features_client.supported 	= true;
			controller.features_client.audioSFX 		= true;
			controller.features_client.audioMusic 	= true;
		}

		if( Browser.chrome ) controller.features_client.gamePad = true;
		
		controller.features_client.mouse 	= true;
		controller.features_client.keyboard 	= true;
	}
};

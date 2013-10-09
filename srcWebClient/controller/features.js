controller.clientFeatures = {
	audioSFX: 	false,
	audioMusic: false,
	gamePad: 	false,
	keyboard:	false,
	mouse:		false,
	touch:		false,
	supported:  false
};

controller.calculateEnvironmentFeatures = function(){
	
	// Mobile Browser
	if( Browser.mobile ){
		
		// ios has *AAA* support
		if( Browser.ios ){
			if( Browser.version >= 5 ) controller.clientFeatures.supported = true;
			if( Browser.version >= 6 ) controller.clientFeatures.audioSFX = true;
		} 
		else if( Browser.android ){
			controller.clientFeatures.supported = true;
		}
			
		controller.clientFeatures.touch = true;
	}
	// Desktop Browser
	else{
		
		// chrome has *AAA* support
		if( Browser.chrome ){
			controller.clientFeatures.supported 	= true;
			controller.clientFeatures.audioSFX 		= true;
			controller.clientFeatures.audioMusic 	= true;
			controller.clientFeatures.gamePad 		= true;
		}
		
		controller.clientFeatures.mouse 	= true;
		controller.clientFeatures.keyboard 	= true;
	}
};
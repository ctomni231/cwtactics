util.scoped(function(){

	var errorPanel  = document.getElementById("cwt_errorPanel");
        var header      = document.getElementById("cwt_errorPanel_reason");
        var stack       = document.getElementById("cwt_errorPanel_data");

	controller.errorButtons = controller.generateButtonGroup( 
	 	errorPanel,
	    "cwt_panel_header_small cwt_page_button cwt_panel_button",
	    "cwt_panel_header_small cwt_page_button cwt_panel_button button_active",
	    "cwt_panel_header_small cwt_page_button cwt_panel_button button_inactive"
	);

        // True if the error panel is visible, else false. +
        //
        // *Read-Only Property*
        // 
	controller.errorPanelVisible = false;

        // Shows the error panel by a given error message and type.
        // 
	controller.showErrorPanel = function(msg,type,stackData){
	    stack.innerHTML               = msg;
	    header.innerHTML              = type;
	    errorPanel.style.display      = "block";
	    controller.errorPanelVisible  = true;
	};

        // Hides the error panel.
        // 
	controller.hideErrorPanel = function(){
	    errorPanel.style.display      = "none";
    	    controller.errorPanelVisible  = false;
	};
});

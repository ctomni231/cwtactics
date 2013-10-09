util.scoped(function(){

	var errorPanel = document.getElementById("cwt_errorPanel");
	var reason = document.getElementById("cwt_errorPanel_reason");
	var data = document.getElementById("cwt_errorPanel_data");

	controller.errorButtons = controller.generateButtonGroup( 
	 	errorPanel,
	    "cwt_panel_header_small cwt_page_button cwt_panel_button",
	    "cwt_panel_header_small cwt_page_button cwt_panel_button button_active",
	    "cwt_panel_header_small cwt_page_button cwt_panel_button button_inactive"
	);

	controller.errorPanelVisible = false;

	controller.showErrorPanel = function(errorId, errorData, stackData){
	  	errorPanel.style.display = "block";
	  	reason.innerHTML = errorId;
	  	data.innerHTML = errorData;
	  	controller.errorPanelVisible = true;
	};

	controller.hideErrorPanel = function(){
	  	errorPanel.style.display = "none";
		controller.errorPanelVisible = false;
	};
});
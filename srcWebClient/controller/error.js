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

	controller.errorPanelVisible = false;

	controller.showErrorPanel = function(msg,stackData){
    stack.innerHTML               = stackData;
    header.innerHTML              = msg;
    errorPanel.style.display      = "block";
    controller.errorPanelVisible  = true;
	};

	controller.hideErrorPanel = function(){
	  errorPanel.style.display      = "none";
    controller.errorPanelVisible  = false;
	};
});
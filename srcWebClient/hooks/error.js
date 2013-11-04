controller.event_on("criticalError",function(errorId, errorData, stackData){
	controller.showErrorPanel(errorId, errorData, stackData);
});
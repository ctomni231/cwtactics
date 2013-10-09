controller.onEvent("criticalError",function(errorId, errorData, stackData){
	controller.showErrorPanel(errorId, errorData, stackData);
});
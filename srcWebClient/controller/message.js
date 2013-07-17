util.scoped(function(){
  
  var panel = document.getElementById("cwt_info_box");
  var contentDiv = document.getElementById("cwt_info_box_content");
  
  var DEFAULT_MESSAGE_TIME = 1000;
  var timeLeft;
  
  view.updateMessagePanelTime = function(delta){
    if( timeLeft > 0 ){
      timeLeft -= delta;
      if( timeLeft <= 0 ){
        panel.className = "uiPopup hide";
      }
    }
  };
  
  view.hasInfoMessage = function(){
    return timeLeft > 0;
  };
  
  view.showInfoMessage = function( msg, time ){
    if( arguments.length === 1 ) time = DEFAULT_MESSAGE_TIME;
    
    // panel.innerHTML = msg;
    contentDiv.innerHTML = msg;
    
    panel.className = "uiPopup show";
    
    timeLeft = time;
  };
  
});
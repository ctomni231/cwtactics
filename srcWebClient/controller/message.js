util.scoped(function(){
  
  var panel 		 = document.getElementById("cwt_info_box");
  var contentDiv = document.getElementById("cwt_info_box_content");
  
  var DEFAULT_MESSAGE_TIME = 2000;
  var timeLeft;
  
  // -------------------------------------------------------------------

  view.updateMessagePanelTime = function(delta){
    if( timeLeft > 0 ){
      timeLeft -= delta;
      if( timeLeft <= 0 ){
        panel.style.opacity = 0;
        panel.style.top = "-1000px";
      }
    }
  };
  
  view.hasInfoMessage = function(){
    return timeLeft > 0;
  };
  
  view.showInfoMessage = function( msg, time ){
    if( arguments.length === 1 ) time = DEFAULT_MESSAGE_TIME;
    
    contentDiv.innerHTML = msg;
    
    panel.style.opacity = 1;
    panel.style.top = "96px";
    
    timeLeft = time;
  };
  
});
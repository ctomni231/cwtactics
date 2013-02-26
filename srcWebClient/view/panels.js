view.ID_DIV_CWTWC_MSG_PANEL            = "cwt_info_box";
view.ID_DIV_CWTWC_MSG_PANEL_CONTENT    = "cwt_info_box_content";

view.DEFAULT_MESSAGE_TIME = 1000;

view._hideInfoMessage = function(){
  var panel = document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL );

  panel.className = "tooltip out";
};

view.hasInfoMessage = function(){
  return document.getElementById( view.ID_DIV_CWTWC_MSG_PANEL
            ).className !== "tooltip out";
};

view.showInfoMessage = function( msg, time ){
  if( arguments.length === 1 ) time = view.DEFAULT_MESSAGE_TIME;

  var panel = document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL );

  // panel.innerHTML = msg;
  document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL_CONTENT ).innerHTML = msg;

  panel.className = "tooltip active";
  panel.style.position = "absolute";
  panel.style.left = parseInt(
    ((window.innerWidth/2) - (panel.offsetWidth/2)), 10
  )+"px";
  panel.style.top = parseInt(
    ((window.innerHeight/2) - (panel.offsetHeight/2)), 10
  )+"px";

  setTimeout( view._hideInfoMessage, time );
};
view.ID_DIV_CWTWC_CURSORINFO    = "cwt_tile_inf";
view.ID_CWTWC_CURSORINFO_IMG    = "tile_inf_pic";
view.ID_CWTWC_CURSORINFO_TNAME  = "tile_inf_name";
view.ID_CWTWC_CURSORINFO_TDEF   = "tile_inf_def";
view.ID_CWTWC_CURSORINFO_UNAME  = "tile_inf_unitname";
view.ID_CWTWC_CURSORINFO_HP     = "tile_inf_hp";
view.ID_CWTWC_CURSORINFO_AMMO   = "tile_inf_ammo";
view.ID_CWTWC_CURSORINFO_FUEL   = "tile_inf_fuel";
view.ID_CWTWC_CURSORINFO_HP_DESC     = "tile_inf_hpDesc";
view.ID_CWTWC_CURSORINFO_AMMO_DESC   = "tile_inf_ammoDesc";
view.ID_CWTWC_CURSORINFO_FUEL_DESC   = "tile_inf_fuelDesc";

view.ID_DIV_CWTWC_PLAYERINFO    = "cwt_player_inf";
view.ID_CWTWC_PLAYERINFO_NAME   = "player_inf_name";
view.ID_CWTWC_PLAYERINFO_GOLD   = "player_inf_gold";
view.ID_CWTWC_PLAYERINFO_COS    = "player_inf_power";
view.ID_CWTWC_PLAYERINFO_NUMPRO = "player_inf_props";
view.ID_CWTWC_PLAYERINFO_NUMUNI = "player_inf_units";

view.ID_DIV_CWTWC_MSG_PANEL            = "cwt_info_box";
view.ID_DIV_CWTWC_MSG_PANEL_CONTENT    = "cwt_info_box_content";

view.showInfoBlocks = function(){
  document.getElementById(
    view.ID_DIV_CWTWC_CURSORINFO ).className="tooltip active";

  document.getElementById(
    view.ID_DIV_CWTWC_PLAYERINFO ).className="tooltip active";
};

view.hideInfoBlocks = function(){
  document.getElementById(
    view.ID_DIV_CWTWC_CURSORINFO ).className="tooltip out";


  document.getElementById(
    view.ID_DIV_CWTWC_PLAYERINFO ).className="tooltip out";
};

view.updateTileInfo = function( left ){
  var x = controller.mapCursorX;
  var y = controller.mapCursorY;

  document.getElementById(
    view.ID_CWTWC_CURSORINFO_TNAME ).innerHTML = model.map[x][y];

  document.getElementById(
    view.ID_CWTWC_CURSORINFO_TDEF ).innerHTML = 0;

  var unit = model.unitPosMap[x][y];
  if( unit !== null ){

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_UNAME ).innerHTML = unit.type;

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_HP ).innerHTML = unit.hp;

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_AMMO ).innerHTML = unit.ammo;

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_FUEL ).innerHTML = unit.fuel;

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_HP_DESC ).innerHTML = "HP";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_AMMO_DESC ).innerHTML = "Ammo";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_FUEL_DESC ).innerHTML = "Fuel";
  }
  else{

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_UNAME ).innerHTML = "";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_HP ).innerHTML = "";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_AMMO ).innerHTML = "";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_FUEL ).innerHTML = "";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_HP_DESC ).innerHTML = "";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_AMMO_DESC ).innerHTML = "";

    document.getElementById(
      view.ID_CWTWC_CURSORINFO_FUEL_DESC ).innerHTML = "";
  }

  var cursorInf = document.getElementById(view.ID_DIV_CWTWC_CURSORINFO );

  cursorInf.style.top = (window.innerHeight - cursorInf.offsetHeight - 15)+"px";
  if( left ){
    cursorInf.style.left = "10px";
  }
  else{
    cursorInf.style.left = (window.innerWidth - cursorInf.offsetWidth - 10)+"px";
  }
};

view.updatePlayerInfo = function( left ){
  var player = model.players[ model.turnOwner ];

  document.getElementById(
    view.ID_CWTWC_PLAYERINFO_NAME ).innerHTML = player.name;

  document.getElementById(
    view.ID_CWTWC_PLAYERINFO_GOLD ).innerHTML = player.gold;

  document.getElementById(
    view.ID_CWTWC_PLAYERINFO_COS ).innerHTML = 0;

  document.getElementById(
    view.ID_CWTWC_PLAYERINFO_NUMPRO ).innerHTML = 0;

  document.getElementById(
    view.ID_CWTWC_PLAYERINFO_NUMUNI ).innerHTML = 0;


  var playerInf = document.getElementById(view.ID_DIV_CWTWC_PLAYERINFO );

  playerInf.style.top = "10px";
  if( left ){
    playerInf.style.left = "10px";
  }
  else{
    playerInf.style.left = (window.innerWidth - playerInf.offsetWidth - 10)+"px";
  }
};

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
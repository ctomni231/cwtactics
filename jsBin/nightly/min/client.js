const CLIENT_DEBUG=!1;controller._soundContext=null,window.addEventListener("load",function(){try{controller.context=new webkitAudioContext}catch(e){util.logWarn("Web Audio API is not supported in this browser")}},!1),controller._sounds={},controller._enabled=!1,controller.enable=function(){controller._enabled===!1&&(controller._enabled=!0)},controller.loadSound=function(e,t){var o=new XMLHttpRequest;o.open("GET",t,!0),o.responseType="arraybuffer",o.onload=function(){controller._soundContext.decodeAudioData(o.response,function(t){controller._sounds[e]=t},null)},util.logInfo("try to load sound");try{o.send()}catch(r){util.logWarn("could not load sound"),controller._enabled=-1}},controller.playMusic=function(){},controller.playSfx=function(e){if(controller._enabled===!0){var t=controller._sounds[e],o=controller._soundContext.createBufferSource();o.buffer=t,o.connect(controller._soundContext.destination),o.noteOn(0)}},controller.mapCursorX=0,controller.mapCursorY=0,controller.menuCursorIndex=-1,controller.resetMenuCursor=function(){controller.menuCursorIndex=0},controller.increaseMenuCursor=function(){controller.menuCursorIndex++},controller.decreaseMenuCursor=function(){controller.menuCursorIndex--,0>controller.menuCursorIndex&&(controller.menuCursorIndex=0)},controller.resetMapCursor=function(){controller.mapCursorX=0,controller.mapCursorY=0},controller.cursorActionCancel=function(){if(null===controller.currentAnimatedKey){var e,t="MOVEPATH_SELECTION"===controller.input.state()||"ACTION_SELECT_TARGET"===controller.input.state();controller.input.event("cancel");var o="MOVEPATH_SELECTION"===controller.input.state()||"ACTION_SELECT_TARGET"===controller.input.state();if((t&&!o||o)&&view.markSelectionMapForRedraw(controller.input.selectionData),e=controller.input.state(),"ACTION_MENU"===e||"ACTION_SUBMENU"===e){var r=controller.input.menu;if("unloadUnit"===controller.input.actionData.getAction()){var n=r;r=[];for(var i=0,a=controller.input.menuSize;a>i;i++)r[i]=model.units[n[i]].type}controller.showMenu(r,controller.input.menuSize,controller.mapCursorX,controller.mapCursorY)}else controller.hideMenu()}},controller.cursorActionClick=function(){if(null===controller.currentAnimatedKey){var e,t="MOVEPATH_SELECTION"===controller.input.state()||"ACTION_SELECT_TARGET"===controller.input.state();-1!==controller.menuCursorIndex?controller.input.event("action",controller.menuCursorIndex):controller.input.event("action",controller.mapCursorX,controller.mapCursorY);var o="MOVEPATH_SELECTION"===controller.input.state()||"ACTION_SELECT_TARGET"===controller.input.state();if((t&&!o||o)&&view.markSelectionMapForRedraw(controller.input.selectionData),e=controller.input.state(),"ACTION_MENU"===e||"ACTION_SUBMENU"===e){var r=controller.input.menu;if("unloadUnit"===controller.input.actionData.getAction()){var n=r;r=[];for(var i=0,a=controller.input.menuSize;a>i;i++)r[i]=model.units[n[i]].type}controller.showMenu(r,controller.input.menuSize,controller.mapCursorX,controller.mapCursorY)}else controller.hideMenu()}},controller.moveCursor=function(e,t){1===arguments.length&&(t=1);var o=controller.mapCursorX,r=controller.mapCursorY;switch(e){case model.MOVE_CODE_UP:r--;break;case model.MOVE_CODE_RIGHT:o++;break;case model.MOVE_CODE_DOWN:r++;break;case model.MOVE_CODE_LEFT:o--}controller.setCursorPosition(o,r)},controller.setCursorPosition=function(e,t,o){if(o&&(e+=controller.screenX,t+=controller.screenY),model.isValidPosition(e,t)&&(e!==controller.mapCursorX||t!==controller.mapCursorY)){view.markForRedraw(controller.mapCursorX,controller.mapCursorY),controller.mapCursorX=e,controller.mapCursorY=t;var r=parseInt(parseInt(window.innerWidth/16,10)/controller.screenScale,10),n=parseInt(parseInt(window.innerHeight/16,10)/controller.screenScale,10),i=-1;1>=e-controller.screenX?i=model.MOVE_CODE_LEFT:e-controller.screenX>=r-1?i=model.MOVE_CODE_RIGHT:1>=t-controller.screenY?i=model.MOVE_CODE_UP:t-controller.screenY>=n-1&&(i=model.MOVE_CODE_DOWN),-1!==i&&controller.shiftScreenPosition(i,5);var a=e+controller.screenX>=r/2;view.updateTileInfo(a),view.updatePlayerInfo(a),view.markForRedraw(e,t)}},controller.currentAnimatedKey=null,controller.currentAnimatedKeyNext=null,controller.noRendering=!0,controller.gameLoop=function(e){var t=0!==controller.moveScreenX||0!==controller.moveScreenY;if(t)controller.solveMapShift();else{if(null===controller.currentAnimatedKey){if(!controller.isBufferEmpty()){var o=controller.evalNextMessageFromBuffer();if(null!==o){var r=o.getAction(),n=o.getMovePath();if(null!==n&&n.length>0){var i=view.getCommandHook("move");controller.currentAnimatedKey=i,i.prepare(o)}var a=view.getCommandHook(r);null!==a&&(a.prepare(o),controller.currentAnimatedKeyNext=a),null===controller.currentAnimatedKey&&null!==controller.currentAnimatedKeyNext&&(controller.currentAnimatedKey=controller.currentAnimatedKeyNext,controller.currentAnimatedKeyNext=null),controller.releaseActionDataObject(o)}}}else controller.currentAnimatedKey.update(e);view.updateSpriteAnimations(e)}!controller.noRendering&&view.drawScreenChanges>0&&view.renderMap(controller.screenScale),controller.noRendering||t||null!==controller.currentAnimatedKey&&(controller.currentAnimatedKey.isDone()?(controller.currentAnimatedKey=null,null!==controller.currentAnimatedKeyNext&&(controller.currentAnimatedKey=controller.currentAnimatedKeyNext,controller.currentAnimatedKeyNext=null)):controller.currentAnimatedKey.render())},controller.enterGameLoop=function(){function e(){requestAnimationFrame(e);var i=(new Date).getTime(),a=i-n;n=i;var l=1e3/((i=new Date)-o);isNaN(l)||(t+=(l-t)/r),o=i,controller.gameLoop(a)}var t=0,o=1*new Date-1,r=50,n=(new Date).getTime(),i=document.getElementById("fps");setInterval(function(){i.innerHTML=CWT_VERSION+" "+t.toFixed(1)+"fps"},1e3),controller.input.event("start"),view.fitScreenToDeviceOrientation(),window.requestAnimationFrame(e)},controller.menuPosX=-1,controller.menuPosY=-1,controller.menuElement=document.getElementById("cwt_menu"),controller.menuEntryListElement=document.getElementById("cwt_menu_entries"),controller._connectMenuListener=function(e,t){e.onclick=function(){controller.menuCursorIndex=t,controller.cursorActionClick()},e.onmouseover=function(){}},controller.showMenu=function(e,t,o,r){var n=TILE_LENGTH*controller.screenScale;1===arguments.length&&(o=controller.menuPosX,r=controller.menuPosY);for(var i=controller.menuEntryListElement.children,a=0,l=i.length;l>a;a++)i[a].style.display="none";for(var a=0,l=t;l>a;a++){var u;if(i.length>a)u=i[a].children[0];else{u=document.createElement("button"),controller._connectMenuListener(u,a);var s=document.createElement("li");s.appendChild(u),controller.menuEntryListElement.appendChild(s)}u.innerHTML=util.i18n_localized(e[a]),i[a].style.display=""}o-=controller.screenX,r-=controller.screenY;var c=parseInt(150/n,10),d=parseInt(160/n,10);r>controller.screenHeight-c&&(r-=parseInt(160/n,10)),o>controller.screenWidth-d&&(o-=parseInt(150/n,10)),controller.menuPosX=o,controller.menuPosY=r,controller.menuCursorIndex=0;var m=controller.menuElement.style;m.top=r*n+"px",m.left=o*n+"px",m.zIndex=2e3,m.display="block"},controller.hideMenu=function(){controller.menuElement.style.display="none",controller.menuCursorIndex=-1},controller.generateMovePath=function(){return[]},controller.appendToPath=function(e){return e},controller.screenElement=document.getElementById("cwt_canvas"),controller.screenX=0,controller.screenY=0,controller.screenWidth=-1,controller.screenHeight=-1,controller.screenScale=1,controller.moveScreenX=0,controller.moveScreenY=0,controller._transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",msTransition:"MSTransitionEnd",transition:"transitionend"},controller.setScreenScale=function(e){1!==e&&2!==e&&3!==e&&util.illegalArgumentError(),controller.screenScale=e,controller.screenElement.className=1===e?"":"scale"+e;var t=TILE_LENGTH*e;controller.screenWidth=parseInt(window.innerWidth/t,10),controller.screenHeight=parseInt(window.innerHeight/t,10),controller.setScreenPosition(controller.screenX,controller.screenY,!1)},controller.setScreenPosition=function(e,t){controller.screenX=e,controller.screenY=t;var o=controller.screenElement.style,r=controller.screenScale,n=-(controller.screenX*TILE_LENGTH*r),i=-(controller.screenY*TILE_LENGTH*r);switch(r){case 2:n+=controller.screenElement.width/2,i+=controller.screenElement.height/2;break;case 3:n+=controller.screenElement.width,i+=controller.screenElement.height}o.position="absolute",o.left=n+"px",o.top=i+"px"},controller.shiftScreenPosition=function(e,t){1===arguments.length&&(t=1);var o=controller.screenX,r=controller.screenY;switch(e){case model.MOVE_CODE_DOWN:r+=t;break;case model.MOVE_CODE_RIGHT:o+=t;break;case model.MOVE_CODE_UP:r-=t;break;case model.MOVE_CODE_LEFT:o-=t}0>o&&(o=0),0>r&&(r=0),o>=model.mapWidth&&(o=model.mapWidth-1),r>=model.mapHeight&&(r=model.mapHeight-1),controller.setScreenPosition(o,r,!1)},controller.updateUnitStats=function(e){var t=e.fuel,o=model.sheets.unitSheets[e.type].maxFuel;e._clientData_.lowFuel=parseInt(.25*o,10)>t?!0:!1;var r=e.ammo,n=model.sheets.unitSheets[e.type].maxAmmo;e._clientData_.lowAmmo=parseInt(.25*n,10)>=r?!0:!1,0===n&&(e._clientData_.lowAmmo=!1);var i=null;90>=e.hp&&(i=e.hp>80?view.getInfoImageForType("HP_9"):e.hp>70?view.getInfoImageForType("HP_8"):e.hp>60?view.getInfoImageForType("HP_7"):e.hp>50?view.getInfoImageForType("HP_6"):e.hp>40?view.getInfoImageForType("HP_5"):e.hp>30?view.getInfoImageForType("HP_4"):e.hp>20?view.getInfoImageForType("HP_3"):e.hp>10?view.getInfoImageForType("HP_2"):view.getInfoImageForType("HP_1")),e._clientData_.hpPic=i},view._animCommands={},view.registerCommandHook=function(e){view._animCommands[e.key]=e,e.isEnabled=!0},view.getCommandHook=function(e){var t=view._animCommands[e];return void 0!==t?t:null},view.IMAGE_CODE_IDLE="IDLE",view.IMAGE_CODE_IDLE_INVERTED="IDLE_R",view.IMAGE_CODE_RIGHT="RIGHT",view.IMAGE_CODE_LEFT="LEFT",view.IMAGE_CODE_UP="UP",view.IMAGE_CODE_DOWN="DOWN",view.IMAGE_CODE_STATELESS="STATELESS",view.COLOR_RED="RED",view.COLOR_GREEN="GREEN",view.COLOR_BLUE="BLUE",view.COLOR_YELLOW="YELLOW",view.COLOR_BLACK_MASK="BLACK_MASK",view.COLOR_NEUTRAL="GRAY",view.COLOR_NONE="NONE",view.IMG_COLOR_MAP_PROPERTIES_ID="IMG_MAP_PROPERTY",view.IMG_COLOR_MAP_UNITS_ID="IMG_MAP_UNIT",view.CodeStatelessview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{},NONE:{},GRAY:{}},view.CodeIdleview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeIdleInvertedview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeRightview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeLeftview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeUpview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeDownview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.setImageForType=function(e,t,o,r){switch(void 0===o&&(o=view.IMAGE_CODE_STATELESS),void 0===r&&(r=view.COLOR_NONE),o){case view.IMAGE_CODE_IDLE:view.CodeIdleview[r][t]=e;break;case view.IMAGE_CODE_STATELESS:view.CodeStatelessview[r][t]=e;break;case view.IMAGE_CODE_IDLE_INVERTED:view.CodeIdleInvertedview[r][t]=e;break;case view.IMAGE_CODE_LEFT:view.CodeLeftview[r][t]=e;break;case view.IMAGE_CODE_RIGHT:view.CodeRightview[r][t]=e;break;case view.IMAGE_CODE_DOWN:view.CodeDownview[r][t]=e;break;case view.IMAGE_CODE_UP:view.CodeUpview[r][t]=e;break;default:util.logError("unknown image state code ",o)}},view.setUnitImageForType=view.setImageForType,view.setPropertyImageForType=function(e,t,o){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,o)},view.setTileImageForType=function(e,t){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.setInfoImageForType=function(e,t){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.getImageForType=function(e,t,o){switch(t){case view.IMAGE_CODE_IDLE:return view.CodeIdleview[o][e];case view.IMAGE_CODE_IDLE_INVERTED:return view.CodeIdleInvertedview[o][e];case view.IMAGE_CODE_LEFT:return view.CodeLeftview[o][e];case view.IMAGE_CODE_RIGHT:return view.CodeRightview[o][e];case view.IMAGE_CODE_DOWN:return view.CodeDownview[o][e];case view.IMAGE_CODE_UP:return view.CodeUpview[o][e];case view.IMAGE_CODE_STATELESS:return view.CodeStatelessview[o][e];default:util.logError("unknown image state code ",t)}},view.getUnitImageForType=view.getImageForType,view.getPropertyImageForType=function(e,t){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,t)},view.getTileImageForType=function(e){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.getInfoImageForType=function(e){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.ID_DIV_CWTWC_CURSORINFO="cwt_tile_inf",view.ID_CWTWC_CURSORINFO_IMG="tile_inf_pic",view.ID_CWTWC_CURSORINFO_TNAME="tile_inf_name",view.ID_CWTWC_CURSORINFO_TDEF="tile_inf_def",view.ID_CWTWC_CURSORINFO_UNAME="tile_inf_unitname",view.ID_CWTWC_CURSORINFO_HP="tile_inf_hp",view.ID_CWTWC_CURSORINFO_AMMO="tile_inf_ammo",view.ID_CWTWC_CURSORINFO_FUEL="tile_inf_fuel",view.ID_CWTWC_CURSORINFO_HP_DESC="tile_inf_hpDesc",view.ID_CWTWC_CURSORINFO_AMMO_DESC="tile_inf_ammoDesc",view.ID_CWTWC_CURSORINFO_FUEL_DESC="tile_inf_fuelDesc",view.ID_DIV_CWTWC_PLAYERINFO="cwt_player_inf",view.ID_CWTWC_PLAYERINFO_NAME="player_inf_name",view.ID_CWTWC_PLAYERINFO_GOLD="player_inf_gold",view.ID_CWTWC_PLAYERINFO_COS="player_inf_power",view.ID_CWTWC_PLAYERINFO_NUMPRO="player_inf_props",view.ID_CWTWC_PLAYERINFO_NUMUNI="player_inf_units",view.ID_DIV_CWTWC_MSG_PANEL="cwt_info_box",view.ID_DIV_CWTWC_MSG_PANEL_CONTENT="cwt_info_box_content",view.showInfoBlocks=function(){document.getElementById(view.ID_DIV_CWTWC_CURSORINFO).className="tooltip active",document.getElementById(view.ID_DIV_CWTWC_PLAYERINFO).className="tooltip active"},view.hideInfoBlocks=function(){document.getElementById(view.ID_DIV_CWTWC_CURSORINFO).className="tooltip out",document.getElementById(view.ID_DIV_CWTWC_PLAYERINFO).className="tooltip out"},view.updateTileInfo=function(e){var t=controller.mapCursorX,o=controller.mapCursorY;document.getElementById(view.ID_CWTWC_CURSORINFO_TNAME).innerHTML=model.map[t][o]+" V:"+model.fogData[t][o],document.getElementById(view.ID_CWTWC_CURSORINFO_TDEF).innerHTML=0;var r=model.unitPosMap[t][o];null!==r?(document.getElementById(view.ID_CWTWC_CURSORINFO_UNAME).innerHTML=r.type,document.getElementById(view.ID_CWTWC_CURSORINFO_HP).innerHTML=r.hp,document.getElementById(view.ID_CWTWC_CURSORINFO_AMMO).innerHTML=r.ammo,document.getElementById(view.ID_CWTWC_CURSORINFO_FUEL).innerHTML=r.fuel,document.getElementById(view.ID_CWTWC_CURSORINFO_HP_DESC).innerHTML="HP",document.getElementById(view.ID_CWTWC_CURSORINFO_AMMO_DESC).innerHTML="Ammo",document.getElementById(view.ID_CWTWC_CURSORINFO_FUEL_DESC).innerHTML="Fuel"):(document.getElementById(view.ID_CWTWC_CURSORINFO_UNAME).innerHTML="",document.getElementById(view.ID_CWTWC_CURSORINFO_HP).innerHTML="",document.getElementById(view.ID_CWTWC_CURSORINFO_AMMO).innerHTML="",document.getElementById(view.ID_CWTWC_CURSORINFO_FUEL).innerHTML="",document.getElementById(view.ID_CWTWC_CURSORINFO_HP_DESC).innerHTML="",document.getElementById(view.ID_CWTWC_CURSORINFO_AMMO_DESC).innerHTML="",document.getElementById(view.ID_CWTWC_CURSORINFO_FUEL_DESC).innerHTML="");var n=document.getElementById(view.ID_DIV_CWTWC_CURSORINFO);n.style.top=window.innerHeight-n.offsetHeight-15+"px",n.style.left=e?"10px":window.innerWidth-n.offsetWidth-10+"px"},view.updatePlayerInfo=function(e){var t=model.players[model.turnOwner];document.getElementById(view.ID_CWTWC_PLAYERINFO_NAME).innerHTML=t.name,document.getElementById(view.ID_CWTWC_PLAYERINFO_GOLD).innerHTML=t.gold,document.getElementById(view.ID_CWTWC_PLAYERINFO_COS).innerHTML=0,document.getElementById(view.ID_CWTWC_PLAYERINFO_NUMPRO).innerHTML=0,document.getElementById(view.ID_CWTWC_PLAYERINFO_NUMUNI).innerHTML=0;var o=document.getElementById(view.ID_DIV_CWTWC_PLAYERINFO);o.style.top="10px",o.style.left=e?"10px":window.innerWidth-o.offsetWidth-10+"px"},view.DEFAULT_MESSAGE_TIME=1e3,view._hideInfoMessage=function(){var e=document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL);e.className="tooltip out"},view.hasInfoMessage=function(){return"tooltip out"!==document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL).className},view.showInfoMessage=function(e,t){1===arguments.length&&(t=view.DEFAULT_MESSAGE_TIME);var o=document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL);document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL_CONTENT).innerHTML=e,o.className="tooltip active",o.style.position="absolute",o.style.left=parseInt(window.innerWidth/2-o.offsetWidth/2,10)+"px",o.style.top=parseInt(window.innerHeight/2-o.offsetHeight/2,10)+"px",setTimeout(view._hideInfoMessage,t)};const TILE_LENGTH=16;controller.baseSize=CWT_MOD_DEFAULT.graphic.baseSize,view.preventRenderUnit=null,view.canvasCtx=controller.screenElement.getContext("2d"),view.renderMap=function(){var e=TILE_LENGTH,t=view.canvasCtx;controller.screenX,controller.screenY;for(var o,r,n,i,a,l,u,s,c,d,m,p=view.getSpriteStep("SELECTION"),E=view.getSpriteStep("UNIT"),_=view.getSpriteStep("PROPERTY"),g=view.getSpriteStep("STATUS"),f=controller.baseSize,h="MOVEPATH_SELECTION"===controller.input.state()||"ACTION_SELECT_TARGET"===controller.input.state(),I=model.mapHeight-1,T=0;I>=T;T++)for(var v=model.mapWidth-1,A=0;v>=A;A++)if(m=0===model.fogData[A][T],view.drawScreen[A][T]===!0){o=model.map[A][T],r=view.getTileImageForType(o),n=0,i=0,a=f,l=2*f,u=A*e,s=T*e-e,c=e,d=2*e,0>s&&(i+=f,l-=f,s+=e,d-=e),void 0!==r?t.drawImage(r,n,i,a,l,u,s,c,d):(t.fillStyle="rgb(0,0,255)",t.fillRect(u,s,e,e));var O=model.propertyPosMap[A][T];if(null!==O){var y;y=-1===O.owner?view.COLOR_NEUTRAL:O.owner===model.turnOwner?view.COLOR_GREEN:model.players[O.owner].team===model.players[model.turnOwner].team?view.COLOR_BLUE:view.COLOR_RED,r=view.getPropertyImageForType(O.type,y),n=0+f*_,i=0,a=f,l=2*f,u=A*e,s=T*e-e,c=e,d=2*e,0>s&&(i+=f,l-=f,s+=e,d-=e),void 0!==r?t.drawImage(r,n,i,a,l,u,s,c,d):(u=A*e,s=T*e,c=e,d=e,t.fillStyle="rgb(0,255,0)",t.fillRect(u,s,c,d))}if(m&&(u=A*e,s=T*e,c=e,d=e,t.globalAlpha=.2,t.fillStyle="black",t.fillRect(u,s,c,d),t.globalAlpha=1),h){r=view.getInfoImageForType("MOVEPATH_SELECTION"===controller.input.state()?"MOVE_FOC":"ATK_FOC");var S=controller.input.selectionData.getPositionValue(A,T);S>0&&(n=f*p,i=0,a=f,l=f,u=A*e,s=T*e,c=e,d=e,t.globalAlpha=.65,t.drawImage(r,n,i,a,l,u,s,c,d),t.globalAlpha=1)}var C=model.unitPosMap[A][T];if(!m&&null!==C&&C!==view.preventRenderUnit){var y;y=-1===C.owner?view.COLOR_NEUTRAL:C.owner===model.turnOwner?view.COLOR_GREEN:model.players[C.owner].team===model.players[model.turnOwner].team?view.COLOR_BLUE:view.COLOR_RED;var w=1===C.owner%2?view.IMAGE_CODE_IDLE:view.IMAGE_CODE_IDLE_INVERTED;r=view.getUnitImageForType(C.type,w,y),n=2*f*E,i=0,a=2*f,l=2*f,u=A*e-e/2,s=T*e-e/2,c=e+e,d=e+e,void 0!==r?(t.drawImage(r,n,i,a,l,u,s,c,d),C.owner!==model.turnOwner||model.canAct(model.extractUnitId(C))||(t.globalAlpha=.5,t.drawImage(view.getUnitImageForType(C.type,w,view.COLOR_BLACK_MASK),n,i,a,l,u,s,c,d),t.globalAlpha=1)):(u=A*e,s=T*e,c=e,d=e,t.fillStyle="rgb(255,0,0)",t.fillRect(u,s,c,d)),r=C._clientData_.hpPic,null!==r&&t.drawImage(r,u+e,s+e),2>=g&&C._clientData_.lowAmmo===!0&&(r=view.getTileImageForType("SYM_AMMO"),t.drawImage(r,u+e/2,s+e)),g>=4&&6>=g&&C._clientData_.lowFuel===!0&&(r=view.getInfoImageForType("SYM_FUEL"),t.drawImage(r,u+e/2,s+e))}view.drawScreen[A][T]=!1}if("MOVEPATH_SELECTION"===controller.input.state())for(var D,P,N,R,M=controller.input.actionData,U=M.getMovePath(),L=M.getSourceX(),W=M.getSourceY(),b=0,F=U.length;F>b&&null!==U[b];b++){switch(D=L,P=W,U[b]){case model.MOVE_CODE_UP:W--;break;case model.MOVE_CODE_RIGHT:L++;break;case model.MOVE_CODE_DOWN:W++;break;case model.MOVE_CODE_LEFT:L--}if(b===F-1||null===U[b+1])N=-1,R=-1;else switch(U[b+1]){case model.MOVE_CODE_UP:N=L,R=W-1;break;case model.MOVE_CODE_RIGHT:N=L+1,R=W;break;case model.MOVE_CODE_DOWN:N=L,R=W+1;break;case model.MOVE_CODE_LEFT:N=L-1,R=W}if(-1==N)switch(U[b]){case model.MOVE_CODE_UP:r=view.getTileImageForType("ARROW_N");break;case model.MOVE_CODE_RIGHT:r=view.getTileImageForType("ARROW_E");break;case model.MOVE_CODE_DOWN:r=view.getTileImageForType("ARROW_S");break;case model.MOVE_CODE_LEFT:r=view.getTileImageForType("ARROW_W")}else{var V=Math.abs(N-D),H=Math.abs(R-P);if(2===V)r=view.getTileImageForType("ARROW_WE");else if(2===H)r=view.getTileImageForType("ARROW_NS");else if(L>N&&P>W||L>D&&R>W)r=view.getTileImageForType("ARROW_SW");else if(L>N&&W>P||L>D&&W>R)r=view.getTileImageForType("ARROW_WN");else if(N>L&&W>P||D>L&&W>R)r=view.getTileImageForType("ARROW_NE");else{if(!(N>L&&P>W||D>L&&R>W)){util.logError("illegal move arrow state","old (",D,",",P,")","current (",L,",",W,")","next (",N,",",R,")","path (",U,")");continue}r=view.getTileImageForType("ARROW_ES")}}L>=0&&W>=0&&controller.screenWidth>L&&controller.screenHeight>W&&t.drawImage(r,L*e,W*e)}t.lineWidth=2,t.strokeStyle="#f00",t.strokeRect(e*controller.mapCursorX+1,e*controller.mapCursorY+1,e-2,e-2),view.drawScreenChanges=0},view.fitScreenToDeviceOrientation=function(){var e=controller.screenElement;e.width=TILE_LENGTH*model.mapWidth,e.height=TILE_LENGTH*model.mapHeight,controller.screenWidth=parseInt(window.innerWidth/TILE_LENGTH,10),controller.screenHeight=parseInt(window.innerHeight/TILE_LENGTH,10)},view.OVERLAYER={MNTN:!0,FRST:!0},view.drawScreenChanges=0,view.drawScreen=util.matrix(CWT_MAX_MAP_WIDTH,CWT_MAX_MAP_HEIGHT,!1),view.markForRedraw=function(e,t){if(e>=0&&t>=0&&model.mapWidth>e&&model.mapHeight>t){if(view.drawScreen[e][t]===!0)return;view.drawScreen[e][t]=!0,view.drawScreenChanges++,t++,model.mapHeight>t&&(null!==model.propertyPosMap[e][t]?view.markForRedraw(e,t):view.OVERLAYER[model.map[e][t]]===!0&&view.markForRedraw(e,t))}else util.logError("illegal arguments ",e,",",t," -> out of view bounds")},view.markForRedrawRange=function(e,t,o){var r,n,i=t-o,a=t+o;for(0>i&&(i=0),a>=model.mapHeight&&(a=model.mapHeight-1);a>=i;i++){var l=Math.abs(i-t);for(r=e-o+l,n=e+o-l,0>r&&(r=0),n>=model.mapWidth&&(n=model.mapWidth-1);n>=r;r++)view.markForRedraw(r,i)}},view.markForRedrawWithNeighbours=function(e,t){t>0&&view.markForRedraw(e,t-1),e>0&&view.markForRedraw(e-1,t),view.markForRedraw(e,t),model.mapHeight-1>t&&view.markForRedraw(e,t+1),model.mapWidth-1>e&&view.markForRedraw(e+1,t)},view.markForRedrawWithNeighboursRing=function(e,t){var o=model.mapWidth,r=model.mapHeight;e>0&&(t>0&&view.markForRedraw(e-1,t-1),view.markForRedraw(e-1,t),r-1>t&&view.markForRedraw(e-1,t+1)),t>0&&view.markForRedraw(e,t-1),view.markForRedraw(e,t),r-1>t&&view.markForRedraw(e,t+1),o-1>e&&(t>0&&view.markForRedraw(e+1,t-1),view.markForRedraw(e+1,t),r-1>t&&view.markForRedraw(e+1,t+1))},view.completeRedraw=function(){view.drawScreenChanges=1;for(var e=0,t=model.mapWidth;t>e;e++)for(var o=0,r=model.mapHeight;r>o;o++)view.drawScreen[e][o]=!0},view.markSelectionMapForRedraw=function(e){for(var t=e.getCenterX(),o=e.getCenterY(),r=e.getDataMatrix(),n=0;r.length>n;n++)for(var i=r[n],a=0;i.length>a;a++)-1!==i[a]&&view.markForRedraw(t+n,o+a)},view.spriteAnimation={},view._spriteAnimators=[],view.registerSpriteAnimator=function(e,t,o,r){var n={};n._stps=t,n._tps=o,n._upt=r,n.step=0,n.time=0,view.spriteAnimation[e]=n,view._spriteAnimators.push(n)},view.getSpriteStep=function(e){return view.spriteAnimation[e].step},view.updateSpriteAnimations=function(e){for(var t=view._spriteAnimators,o=0,r=t.length;r>o;o++){var n=t[o];n.time+=e,n.time>=n._tps&&(n.time=0,n.step++,n.step>=n._stps&&(n.step=0),n._upt())}},view.registerSpriteAnimator("SELECTION",7,150,function(){if("MOVEPATH_SELECTION"===controller.input.state()||"ACTION_SELECT_TARGET"===controller.input.state())for(var e=0,t=0,o=model.mapWidth,r=model.mapHeight,n=controller.input.selectionData;o>e;e++)for(var i=t;r>i;i++)n.getPositionValue(e,i)>-1&&view.markForRedraw(e,i)}),view.registerSpriteAnimator("STATUS",8,375,function(){}),view.registerSpriteAnimator("UNIT",3,250,function(){for(var e=0,t=0,o=model.mapWidth,r=model.mapHeight;o>e;e++)for(var n=t;r>n;n++)null!==model.unitPosMap[e][n]&&view.markForRedrawWithNeighbours(e,n)}),view.registerSpriteAnimator("PROPERTY",4,400,function(){for(var e=0,t=0,o=model.mapWidth,r=model.mapHeight;o>e;e++)for(var n=t;r>n;n++)null!==model.propertyPosMap[e][n]&&view.markForRedrawWithNeighbours(e,n)}),view.registerCommandHook({key:"addVisioner",prepare:function(e){var t,o,r=e.getSourceX(),n=e.getSourceY(),i=e.getSubAction(),a=n-i,l=n+i;for(0>a&&(a=0),l>=model.mapHeight&&(l=model.mapHeight-1);l>=a;a++){var u=Math.abs(a-n);for(t=r-i+u,o=r+i-u,0>t&&(t=0),o>=model.mapWidth&&(o=model.mapWidth-1);o>=t;t++)view.markForRedraw(t,a)}},render:function(){},update:function(){},isDone:function(){return!0}}),view.registerCommandHook({key:"attack",prepare:function(e){controller.updateUnitStats(e.getSourceUnit()),controller.updateUnitStats(e.getTargetUnit())},render:function(){},update:function(){},isDone:function(){return!0}}),view.registerCommandHook({key:"buildUnit",prepare:function(e){var t=e.getSourceX(),o=e.getSourceY(),r=model.unitPosMap[t][o];controller.updateUnitStats(r)},render:function(){},update:function(){},isDone:function(){return!0}}),view.registerCommandHook({key:"captureProperty",prepare:function(e){var t=e.getTargetProperty();20===t.capturePoints?view.showInfoMessage(util.i18n_localized("propertyCaptured")):view.showInfoMessage(util.i18n_localized("propertyPointsLeft")+" "+t.capturePoints)},render:function(){},update:function(){},isDone:function(){return!view.hasInfoMessage()}}),view.registerCommandHook({key:"endGame",prepare:function(){view.showInfoMessage(util.i18n_localized("gameHasEnded"),36e5)},render:function(){},update:function(){},isDone:function(){return!1}}),view.registerCommandHook({key:"invokeMultiStepAction",prepare:function(){var e=controller.input.state();("ACTION_MENU"===e||"ACTION_SUBMENU"===e)&&controller.showMenu(controller.input.menu,controller.input.menuSize,controller.mapCursorX,controller.mapCursorY)},render:function(){},update:function(){},isDone:function(){return!0}}),view.registerCommandHook({key:"join",prepare:function(e){controller.updateUnitStats(e.getTargetUnit())},render:function(){},update:function(){},isDone:function(){return!0}}),view.registerCommandHook({key:"move",prepare:function(e){controller.actiondata,this.moveAnimationX=e.getSourceX(),this.moveAnimationY=e.getSourceY(),this.moveAnimationIndex=0,this.moveAnimationPath=e.getMovePath(),this.moveAnimationUid=e.getSourceUnitId(),this.moveAnimationShift=0,view.preventRenderUnit=e.getSourceUnit(),controller.updateUnitStats(e.getSourceUnit())},update:function(e){var t=TILE_LENGTH;if(this.moveAnimationShift+=e/1e3*12*t,view.markForRedrawWithNeighboursRing(this.moveAnimationX,this.moveAnimationY),this.moveAnimationShift>t){switch(this.moveAnimationPath[this.moveAnimationIndex]){case model.MOVE_CODE_UP:this.moveAnimationY--;break;case model.MOVE_CODE_RIGHT:this.moveAnimationX++;break;case model.MOVE_CODE_DOWN:this.moveAnimationY++;break;case model.MOVE_CODE_LEFT:this.moveAnimationX--}this.moveAnimationIndex++,this.moveAnimationShift-=t,this.moveAnimationIndex===this.moveAnimationPath.length&&(this.moveAnimationX=0,this.moveAnimationY=0,this.moveAnimationIndex=0,this.moveAnimationPath=null,this.moveAnimationUid=-1,this.moveAnimationShift=0,view.preventRenderUnit=null)}},render:function(){var e,t=this.moveAnimationUid,o=this.moveAnimationX,r=this.moveAnimationY,n=this.moveAnimationShift,i=this.moveAnimationPath[this.moveAnimationIndex],a=model.units[t];e=a.owner===model.turnOwner?view.COLOR_GREEN:model.players[a.owner].team===model.players[model.turnOwner].team?view.COLOR_BLUE:view.COLOR_RED;var l,u=a.type;switch(i){case model.MOVE_CODE_UP:l=view.IMAGE_CODE_UP;break;case model.MOVE_CODE_RIGHT:l=view.IMAGE_CODE_RIGHT;break;case model.MOVE_CODE_DOWN:l=view.IMAGE_CODE_DOWN;break;case model.MOVE_CODE_LEFT:l=view.IMAGE_CODE_LEFT}var s=view.getUnitImageForType(u,l,e),c=TILE_LENGTH,d=controller.baseSize,m=2*d*view.getSpriteStep("UNIT"),p=0,E=2*d,_=2*d,g=o*c-c/2,f=r*c-c/2,h=c+c,I=c+c;switch(i){case model.MOVE_CODE_UP:f-=n;break;case model.MOVE_CODE_LEFT:g-=n;break;case model.MOVE_CODE_RIGHT:g+=n;break;case model.MOVE_CODE_DOWN:f+=n}if(void 0!==s)view.canvasCtx.drawImage(s,m,p,E,_,g,f,h,h);else{switch(g=o*c,f=r*c,h=c,I=c,i){case model.MOVE_CODE_UP:f-=n;break;case model.MOVE_CODE_LEFT:g-=n;break;case model.MOVE_CODE_RIGHT:g+=n;break;case model.MOVE_CODE_DOWN:f+=n}view.canvasCtx.fillStyle="rgb(255,0,0)",view.canvasCtx.fillRect(g,f,h,I)}},isDone:function(){return-1===this.moveAnimationUid}}),view.registerCommandHook({key:"nextTurn",prepare:function(){model.fogOn&&view.completeRedraw(),view.showInfoMessage(util.i18n_localized("day")+": "+model.day)},render:function(){},update:function(){},isDone:function(){return!view.hasInfoMessage()}}),view.registerCommandHook({key:"remVisioner",prepare:function(e){var t,o,r=e.getSourceX(),n=e.getSourceY(),i=e.getSubAction(),a=n-i,l=n+i;for(0>a&&(a=0),l>=model.mapHeight&&(l=model.mapHeight-1);l>=a;a++){var u=Math.abs(a-n);for(t=r-i+u,o=r+i-u,0>t&&(t=0),o>=model.mapWidth&&(o=model.mapWidth-1);o>=t;t++)view.markForRedraw(t,a)}},render:function(){},update:function(){},isDone:function(){return!0}}),controller.registerCommand({key:"colorizeImages",UNIT_INDEXES:{BLACK_MASK:8,RED:0,BLUE:3,GREEN:4,colors:6},PROPERTY_INDEXES:{RED:0,GRAY:1,BLUE:3,GREEN:4,YELLOW:5,colors:4},condition:util.FUNCTION_FALSE_RETURNER,action:function(){function e(e){var t=document.createElement("canvas"),o=t.getContext("2d"),r=e.width,n=e.height;return t.width=r,t.height=n,o.drawImage(e,0,0),o.getImageData(0,0,r,n).data}function t(e,t,o,r,n){var i=document.createElement("canvas"),a=i.getContext("2d"),l=e.width,u=e.height;i.width=l,i.height=u,a.drawImage(e,0,0);for(var s=a.getImageData(0,0,l,u),c=4*r*o,d=4*n*o,m=0;s.height>m;m++)for(var p=0;s.width>p;p++)for(var E=4*m*s.width+4*p,_=s.data[E],g=s.data[E+1],f=s.data[E+2],h=0,I=4*o;I>h;h+=4){var T=t[c+h],v=t[c+h+1],A=t[c+h+2];if(T===_&&v===g&&A===f){var O=d+h,y=t[O],S=t[O+1],C=t[O+2];s.data[E]=y,s.data[E+1]=S,s.data[E+2]=C}}return a.putImageData(s,0,0),i}for(var o=[view.IMAGE_CODE_IDLE,view.IMAGE_CODE_IDLE_INVERTED,view.IMAGE_CODE_DOWN,view.IMAGE_CODE_UP,view.IMAGE_CODE_RIGHT,view.IMAGE_CODE_LEFT],r=e(view.getInfoImageForType(view.IMG_COLOR_MAP_PROPERTIES_ID)),n=e(view.getInfoImageForType(view.IMG_COLOR_MAP_UNITS_ID)),i=CWT_MOD_DEFAULT.graphic.units,a=0,l=i.length;l>a;a++)for(var u=i[a][0],s=0,c=o.length;c>s;s++){var d=o[s],m=view.getUnitImageForType(u,d,view.COLOR_RED);view.setUnitImageForType(t(m,n,this.UNIT_INDEXES.colors,this.UNIT_INDEXES.RED,this.UNIT_INDEXES.BLUE),u,d,view.COLOR_BLUE),view.setUnitImageForType(t(m,n,this.UNIT_INDEXES.colors,this.UNIT_INDEXES.RED,this.UNIT_INDEXES.GREEN),u,d,view.COLOR_GREEN),view.setUnitImageForType(t(m,n,this.UNIT_INDEXES.colors,this.UNIT_INDEXES.RED,this.UNIT_INDEXES.BLACK_MASK),u,d,view.COLOR_BLACK_MASK)}for(var p=CWT_MOD_DEFAULT.graphic.properties,a=0,l=p.length;l>a;a++){var u=p[a][0],m=view.getPropertyImageForType(u,view.COLOR_RED);view.setPropertyImageForType(t(m,r,this.PROPERTY_INDEXES.colors,this.PROPERTY_INDEXES.RED,this.PROPERTY_INDEXES.BLUE),u,view.COLOR_BLUE),view.setPropertyImageForType(t(m,r,this.PROPERTY_INDEXES.colors,this.PROPERTY_INDEXES.RED,this.PROPERTY_INDEXES.GREEN),u,view.COLOR_GREEN),view.setPropertyImageForType(t(m,r,this.PROPERTY_INDEXES.colors,this.PROPERTY_INDEXES.RED,this.PROPERTY_INDEXES.GRAY),u,view.COLOR_NEUTRAL)}}}),controller.registerCommand({key:"cutImages",condition:util.FUNCTION_FALSE_RETURNER,action:function(){function e(e,t,o){var r=t?-1:1,n=o?-1:1,i=t?-1*e.width:0,a=o?-1*e.height:0,l=document.createElement("canvas");l.height=e.height,l.width=e.width;var u=l.getContext("2d");return u.save(),u.scale(r,n),u.drawImage(e,i,a,e.width,e.height),u.restore(),l}CWT_MOD_DEFAULT.graphic.baseSize,DEBUG&&util.logInfo("cutting unit commands into single types");
for(var t=CWT_MOD_DEFAULT.graphic.units,o=0,r=t.length;r>o;o++){var n,i,a=view.COLOR_RED,l=t[o][0],u=view.getUnitImageForType(l,view.IMAGE_CODE_IDLE,a);n=document.createElement("canvas"),n.height=32,n.width=96,i=n.getContext("2d"),i.drawImage(u,0,0,96,32,0,0,96,32),view.setUnitImageForType(n,l,view.IMAGE_CODE_IDLE,a),n=document.createElement("canvas"),n.height=32,n.width=96,i=n.getContext("2d"),i.drawImage(u,0,0,96,32,0,0,96,32),view.setUnitImageForType(e(n,!0,!1),l,view.IMAGE_CODE_IDLE_INVERTED,a),n=document.createElement("canvas"),n.height=32,n.width=96,i=n.getContext("2d"),i.drawImage(u,288,0,96,32,0,0,96,32),view.setUnitImageForType(n,l,view.IMAGE_CODE_LEFT,a),n=document.createElement("canvas"),n.height=32,n.width=96,i=n.getContext("2d"),i.drawImage(u,288,0,96,32,0,0,96,32),view.setUnitImageForType(e(n,!0,!1),l,view.IMAGE_CODE_RIGHT,a),n=document.createElement("canvas"),n.height=32,n.width=96,i=n.getContext("2d"),i.drawImage(u,96,0,96,32,0,0,96,32),view.setUnitImageForType(n,l,view.IMAGE_CODE_UP,a),n=document.createElement("canvas"),n.height=32,n.width=96,i=n.getContext("2d"),i.drawImage(u,192,0,96,32,0,0,96,32),view.setUnitImageForType(n,l,view.IMAGE_CODE_DOWN,a)}DEBUG&&util.logInfo("cutting unit commands into single types done"),DEBUG&&util.logInfo("cutting misc into single types");for(var s=CWT_MOD_DEFAULT.graphic.misc,o=0,r=s.length;r>o;o++){var c=s[o];if(c.length>2){var u=view.getInfoImageForType(c[0]);n=document.createElement("canvas"),n.height=16,n.width=16,i=n.getContext("2d"),c.length>6&&(i.save(),i.translate(8,8),i.rotate(c[6]*Math.PI/180),i.translate(-8,-8)),i.drawImage(u,c[2],c[3],c[4],c[5],0,0,16,16),c.length>6&&i.restore(),view.setInfoImageForType(n,c[0])}}DEBUG&&util.logInfo("cutting misc into single types done")}}),controller.registerCommand({key:"loadImages",localAction:!0,condition:util.FUNCTION_FALSE_RETURNER,action:function(){controller.lockCommandEvaluation=!0;var e="../../../image/",t=function(e){for(var t=0,o=e.length;o>t;t++)if(e[t].complete!==!0)return!1;return!0},o=function(o,r){for(var n,i=[],a=[],l=0,u=o.length;u>l;l++)n=new Image,n.src=e+o[l][1],i[l]=n,a[l]=o[l][0];var s=function(){t(i)?r(a,i):setTimeout(s,250)};s()},r=4;util.DEBUG&&util.logInfo("loading unit commands"),o(CWT_MOD_DEFAULT.graphic.units,function(e,t){for(var o=0,n=e.length;n>o;o++)view.setUnitImageForType(t[o],e[o],view.IMAGE_CODE_IDLE,view.COLOR_RED);util.DEBUG&&util.logInfo("unit commands loaded"),r--}),util.DEBUG&&util.logInfo("loading property commands"),o(CWT_MOD_DEFAULT.graphic.properties,function(e,t){for(var o=0,n=e.length;n>o;o++)view.setPropertyImageForType(t[o],e[o],view.COLOR_RED);util.DEBUG&&util.logInfo("property commands loaded"),r--}),util.DEBUG&&util.logInfo("loading tile commands"),o(CWT_MOD_DEFAULT.graphic.tiles,function(e,t){for(var o=0,n=e.length;n>o;o++)view.setTileImageForType(t[o],e[o]);util.DEBUG&&util.logInfo("tile commands loaded"),r--}),util.DEBUG&&util.logInfo("loading other commands"),o(CWT_MOD_DEFAULT.graphic.misc,function(e,t){for(var o=0,n=e.length;n>o;o++)view.setInfoImageForType(t[o],e[o]);util.DEBUG&&util.logInfo("other commands loaded"),r--}),util.DEBUG&&util.logInfo("waiting for commands");var n=function(){0===r?(util.DEBUG&&util.logInfo("all commands are loaded"),controller.lockCommandEvaluation=!1):setTimeout(n,250)};n()}}),controller.INPUT_KEYBOARD_CODE_LEFT=37,controller.INPUT_KEYBOARD_CODE_UP=38,controller.INPUT_KEYBOARD_CODE_RIGHT=39,controller.INPUT_KEYBOARD_CODE_DOWN=40,controller.INPUT_KEYBOARD_CODE_BACKSPACE=8,controller.INPUT_KEYBOARD_CODE_ENTER=13,controller.INPUT_KEYBOARD_CODE_M=77,controller.INPUT_KEYBOARD_CODE_N=78,controller.registerCommand({key:"loadInputDevices",condition:util.FUNCTION_FALSE_RETURNER,action:function(){var e=new DeviceDetection(navigator.userAgent);if(e.isDesktop()&&(document.onkeydown=function(e){var t=e.keyCode;switch(t){case controller.INPUT_KEYBOARD_CODE_LEFT:controller.moveCursor(model.MOVE_CODE_LEFT,1);break;case controller.INPUT_KEYBOARD_CODE_UP:controller.moveCursor(model.MOVE_CODE_UP,1);break;case controller.INPUT_KEYBOARD_CODE_RIGHT:controller.moveCursor(model.MOVE_CODE_RIGHT,1);break;case controller.INPUT_KEYBOARD_CODE_DOWN:controller.moveCursor(model.MOVE_CODE_DOWN,1);break;case controller.INPUT_KEYBOARD_CODE_BACKSPACE:controller.cursorActionCancel();break;case controller.INPUT_KEYBOARD_CODE_ENTER:controller.cursorActionClick();break;case controller.INPUT_KEYBOARD_CODE_M:3>controller.screenScale&&controller.setScreenScale(controller.screenScale+1);break;case controller.INPUT_KEYBOARD_CODE_N:controller.screenScale>1&&controller.setScreenScale(controller.screenScale-1)}switch(t){case controller.INPUT_KEYBOARD_CODE_LEFT:case controller.INPUT_KEYBOARD_CODE_UP:case controller.INPUT_KEYBOARD_CODE_RIGHT:case controller.INPUT_KEYBOARD_CODE_DOWN:case controller.INPUT_KEYBOARD_CODE_BACKSPACE:case controller.INPUT_KEYBOARD_CODE_ENTER:case controller.INPUT_KEYBOARD_CODE_M:case controller.INPUT_KEYBOARD_CODE_N:return!1}}),e.isDesktop()){var t=document.getElementById("cwt_canvas");t.onmousemove=function(e){var t,o;"number"==typeof e.offsetX?(t=e.offsetX,o=e.offsetY):(t=e.layerX,o=e.layerY);var t=parseInt(t/16,10),o=parseInt(o/16,10);controller.setCursorPosition(t,o)},t.onmousedown=function(e){switch(e.which){case 1:controller.cursorActionClick();break;case 2:break;case 3:controller.cursorActionCancel()}}}if(e.isAndroid()||e.isTouchDevice()){var o=document.getElementById("cwt_canvas"),r=new Hammer(o,{prevent_default:!0});r.ontap=function(e){var t=e.position[0].x,o=e.position[0].y,r=controller.screenScale*TILE_LENGTH,t=parseInt(t/r,10),o=parseInt(o/r,10);t+=controller.screenX,o+=controller.screenY,controller.setCursorPosition(t,o),controller.cursorActionClick()},r.onhold=function(){controller.cursorActionCancel()},r.onrelease=function(){},r.ondrag=function(){},r.ondragend=function(e){var t=TILE_LENGTH*controller.screenScale,o=e.angle,r=0;o>=-135&&-45>o?r=model.MOVE_CODE_UP:o>=-45&&45>o?r=model.MOVE_CODE_RIGHT:o>=45&&135>o?r=model.MOVE_CODE_DOWN:(o>=135||-135>o)&&(r=model.MOVE_CODE_LEFT);var n=parseInt(e.distance/t,10);0===n&&(n=1),controller.shiftScreenPosition(r,n)},r.ontransformend=function(e){return e.scale>1?3>controller.screenScale&&controller.setScreenScale(controller.screenScale+1):controller.screenScale>1&&controller.setScreenScale(controller.screenScale-1),!1}}}}),controller.registerCommand({key:"loadSounds",localAction:!0,condition:util.FUNCTION_FALSE_RETURNER,action:function(){}}),controller.registerCommand({key:"startRendering",localAction:!0,condition:util.FUNCTION_FALSE_RETURNER,action:function(){view.showInfoBlocks(),controller.noRendering=!1,view.fitScreenToDeviceOrientation(),view.completeRedraw(),view.updateTileInfo(),view.updatePlayerInfo();for(var e=0,t=model.units.length;t>e;e++)model.units[e].owner!==CWT_INACTIVE_ID&&controller.updateUnitStats(model.units[e]);model.generateFogMap(0)}}),function(){function e(e){var t=controller.aquireActionDataObject();t.setAction(e),controller.pushActionDataIntoBuffer(t)}for(var t=[["chrome",18,19,20,21,22,23,24],["firefox",17,18,19],["safari",5,6]],o=!1,r=0,n=t.length;n>r;r++){var i=t[r];if(BrowserDetection[i[0]]===!0){o=!0;for(var a=!1,l=1,u=i.length;u>l;l++)0===BrowserDetection.version.indexOf(i[l])&&(a=!0);o||alert("Attention!\nThe version of your browser is not supported!")}}o||alert("Attention!\nYour browser is not supported!"),e("loadMod"),e("loadImages"),e("cutImages"),e("colorizeImages"),e("loadInputDevices"),e("loadSounds");var s=controller.aquireActionDataObject();s.setAction("loadGame"),s.setSubAction(testMap),controller.pushActionDataIntoBuffer(s),util.i18n_setLanguage("en"),e("startRendering")}();
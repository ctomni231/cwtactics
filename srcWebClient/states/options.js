util.scoped(function(){
  
  function saveComplete(){
    if( constants.DEBUG ) util.log("successfully set new mod path");
  }
  
  function wipeComplete(){
    if( constants.DEBUG ) util.log("successfully set wipe out... next start with clean data");
  }
  
  var index = -1;
  var elements = [
    document.getElementById(ID_ELMT_OTIONS_SFX_VOL),
    document.getElementById(ID_ELMT_OTIONS_MUSIC_VOL),
    document.getElementById(ID_ELMT_OTIONS_RESET),
    document.getElementById("cwt_options_mapIn"),
    document.getElementById("cwt_options_addMap"),
    document.getElementById(ID_ELMT_OTIONS_GOBACK)
  ];
  
  var label1 = document.getElementById("cwt_options_sfxVolume_desc");
  var label2 = document.getElementById("cwt_options_musicVolume_desc");
  var label3 = document.getElementById("cwt_options_reset");
  var label4 = document.getElementById("cwt_options_goBack");
  var label5 = document.getElementById("cwt_options_addMap");
  
  var nodeSfx   = document.getElementById( "cwt_options_sfxVolume" );
  var nodeMusic = document.getElementById( "cwt_options_musicVolume" );
  
  var modText = document.getElementById( ID_ELMT_OTIONS_MOD_INFO );
  
  function register(i){
    elements[i].onmouseover = function(){
      if( index !== 3 ) elements[index].className = "menuButton";
      index = i;
      if( index !== 3 ) elements[index].className = "menuButton active";
    };
  }
  
  // REGISTERS MOUSE ONHOVER EVENT
  for( var i=0,e=elements.length; i<e; i++ ) register(i);
  
  // ------------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.OPTIONS.onenter = function(){
    
    // SET LOCALIZED BUTTONS
    label1.innerHTML = model.localized( label1.attributes.key.value );
    label2.innerHTML = model.localized( label2.attributes.key.value );
    label3.innerHTML = model.localized( label3.attributes.key.value );
    label4.innerHTML = model.localized( label4.attributes.key.value );
    label5.innerHTML = model.localized( label5.attributes.key.value );
    
    this.data.openSection( ID_MENU_SECTION_OPTIONS );
    if( index !== -1 && index !== 3 ) elements[index].className = "menuButton";
    
    index = 0;
    elements[index].className = "menuButton active";
    
    nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
    nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
  };
  
  controller.screenStateMachine.structure.OPTIONS.UP = function(){
    if( index !== 3 ) elements[index].className = "menuButton";
    
    index--;
    if( index < 0 ) index = elements.length-1;
    
    if( index !== 3 ) elements[index].className = "menuButton active";
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.DOWN = function(){
    if( index !== 3 ) elements[index].className = "menuButton";
    
    index++;
    if( index >= elements.length ) index = 0;
    
    if( index !== 3 ) elements[index].className = "menuButton active";
    return this.BREAK_TRANSITION;    
  };
  
  controller.screenStateMachine.structure.OPTIONS.ACTION = function(){
    var selectedId = elements[index].id;
    
    switch( selectedId ){
        
      case ID_ELMT_OTIONS_MOD_TAKE: 
        var content = modText.value;
        controller.storage.set("modificationPath",content, saveComplete );
        controller.storage.set("resetDataAtStart",{value:true}, wipeComplete );
        break;
        
      case ID_ELMT_OTIONS_RESET:
        controller.storage.set("resetDataAtStart",{value:true}, wipeComplete );
        break;
        
      case "cwt_options_addMap":
        try{
          var data = document.getElementById("cwt_options_mapIn").value;
          data = JSON.parse( data );
          model.checkMap( data );
        }
        catch( e ){
          controller.loadError = "illegal map";
          return "MAIN";
        }
        
        controller.storage.set( data.name , data, function(){
          controller.mapList.push({ name:data.name, key:data.name });
        });
        break;
        
      case ID_ELMT_OTIONS_GOBACK: 
        controller.saveSoundConfigs();
        return "MAIN";
    }
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.LEFT = function(){
    var selectedId = elements[index].id;
    
    switch( selectedId ){
        
      case ID_ELMT_OTIONS_SFX_VOL:
        controller.setSfxVolume( controller.getSfxVolume()-0.05 );
        nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
        break;
        
      case ID_ELMT_OTIONS_MUSIC_VOL:
        controller.setMusicVolume( controller.getMusicVolume()-0.05 );
        nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
        break;
    }
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.RIGHT = function(){
    var selectedId = elements[index].id;
    
    switch( selectedId ){
        
      case ID_ELMT_OTIONS_SFX_VOL:
        controller.setSfxVolume( controller.getSfxVolume()+0.05 );
        nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
        break;
        
      case ID_ELMT_OTIONS_MUSIC_VOL:
        controller.setMusicVolume( controller.getMusicVolume()+0.05 );
        nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
        break;
    }
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.CANCEL = function(){
    controller.saveSoundConfigs();
    return "MAIN";
  };
  
});
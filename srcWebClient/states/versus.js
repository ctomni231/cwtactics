util.scoped(function(){
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_versus_screen"),
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive"
  );
  
  var cPage = 0;
  var cCategory = 0;
  
  var nameBtns = [
    document.getElementById("options.versus.map.1"),
    document.getElementById("options.versus.map.2"),
    document.getElementById("options.versus.map.3"),
    document.getElementById("options.versus.map.4"),
    document.getElementById("options.versus.map.5")
  ];

  var metaBtns = [
    document.getElementById("options.versus.meta.1"),
    document.getElementById("options.versus.meta.2"),
    document.getElementById("options.versus.meta.3"),
    document.getElementById("options.versus.meta.4"),
    document.getElementById("options.versus.meta.5"),
    document.getElementById("options.versus.meta.6")
  ];

  var metaCanvasBtns = [
    document.getElementById("options.versus.meta.1.canvas"),
    document.getElementById("options.versus.meta.2.canvas"),
    document.getElementById("options.versus.meta.3.canvas"),
    document.getElementById("options.versus.meta.4.canvas"),
    document.getElementById("options.versus.meta.5.canvas"),
    document.getElementById("options.versus.meta.6.canvas")
  ];
  
  var nameValues = [
    null,
    null,
    null,
    null,
    null
  ];
  
  var selectedMap = null;
  
  var mapNamBtn = document.getElementById("versus.map.category");
  var pageBtn = document.getElementById("versus.mapSelect.page");
  
  // meta
  var meta_sizex_btn = document.getElementById("map_meta_sizex");
  var meta_sizey_btn = document.getElementById("map_meta_sizey");
  var meta_prop_btn = document.getElementById("map_meta_properties");
  var meta_players_btn = document.getElementById("map_meta_players");
  
  function setCategory( index ){
    
  }
  
  function mapLoadStart( mapName ){
    controller.input_requestBlock();
    controller.storage_maps.get( mapName, mapLoadFinish );
  }
  
  function mapLoadFinish( obj ){

    // set meta data
    controller.metadata_grabFromMapData( obj.value, 
      metaBtns, metaCanvasBtns, model.data_header.map_meta );
    
    mapNamBtn.innerHTML = obj.value.name;
    
    // generate mini map
    controller.minimap_renderMapSelectionMinimap(obj.value);
    
    // release input lock
    controller.input_releaseBlock();
  }
  
  
  function selectIndex( index ){
    
    // is there a map element ?
    if( !nameValues[index] ) return;
    
    // reset meta data
    controller.metadata_grabFromMapData( null, metaBtns, metaCanvasBtns, null );

    selectedMap         = nameValues[index];
    mapLoadStart(nameValues[index]);
  }
  
  function updateButton( index, value ){
    if( value ){
      nameBtns[index].innerHTML = value;
      nameValues[index] = value;      
    } else {
      nameBtns[index].innerHTML = "&#160;";
      nameValues[index] = null;
    }
  }
  
  function setPage( index ){
    var newV = 5*index;
    if( newV >= 0 && newV < model.data_maps.length ){
      
      updateButton( 0, model.data_maps[newV] );
      updateButton( 1, (newV+1 < model.data_maps.length)? model.data_maps[newV+1] : null );
      updateButton( 2, (newV+2 < model.data_maps.length)? model.data_maps[newV+2] : null );
      updateButton( 3, (newV+3 < model.data_maps.length)? model.data_maps[newV+3] : null );
      updateButton( 4, (newV+4 < model.data_maps.length)? model.data_maps[newV+4] : null );
      
      pageBtn.innerHTML = index+1;
      cPage = index;
    }
  }
  
  function loadMap( obj ){
    var map = obj.value;

    // update model
    controller.persistence_prepareModel(map);
    controller.roundConfig_prepare();
  }
  
  function loadMapExtPlay( obj ){
    loadMap(obj);
    controller.screenStateMachine.event("_toConf");
  }
  
  function loadMapQuickPlay( obj ){
    loadMap(obj);        
    controller.roundConfig_evalAfterwards();
    controller.screenStateMachine.event("_toMap");
  }
  
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.VERSUS = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.VERSUS.section = "cwt_versus_screen";
	
  controller.screenStateMachine.structure.VERSUS._toConf = function(){
    return "PLAYER_SETUP";
  };
  
  controller.screenStateMachine.structure.VERSUS._toMap = function(){
    return "GAMEROUND";
  };
  
  controller.screenStateMachine.structure.VERSUS.enterState = function(){
    setPage(0);
    selectedMap = null;
  };
  
  controller.screenStateMachine.structure.VERSUS.UP = function(){
    switch( btn.getActiveKey() ){
        
      case "options.versus.quickMatch":
        btn.decreaseIndex(3);
        break;
                
      case "options.goBack":
      case "options.nextPage.small":
      case "options.versus.configuredMatch":
        btn.decreaseIndex(2);
        break;
                
      default: 
        btn.decreaseIndex();
    }
    
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.VERSUS.DOWN = function(){
    switch( btn.getActiveKey() ){
        
      case "options.goBack":
      case "options.versus.quickMatch":
        btn.increaseIndex(3);
        break;
        
      case "options.prevPage.small":
      case "options.versus.configuredMatch":
        btn.increaseIndex(2);
        break;
                
      default: 
        btn.increaseIndex();
    }   
    
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.VERSUS.LEFT = function(){
    switch( btn.getActiveKey() ){
      case "options.nextPage.small":
      case "options.versus.configuredMatch":
      case "options.versus.quickMatch":
        btn.decreaseIndex();
        break;
    }
    
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.VERSUS.RIGHT = function(){ 
    switch( btn.getActiveKey() ){
      case "options.prevPage.small":
      case "options.versus.configuredMatch":
      case "options.goBack":
        btn.increaseIndex();
        break;
    }
    
    return this.breakTransition();
  };
    
  controller.screenStateMachine.structure.VERSUS.CANCEL = function(){
    return "MAIN";
  };
  
  controller.screenStateMachine.structure.VERSUS.ACTION = function(){
    switch( btn.getActiveKey() ){
        
      case "options.goBack":
        return "MAIN";
        
      case "options.versus.configuredMatch":
        if( selectedMap ){
          controller.storage_maps.get( selectedMap, loadMapExtPlay );
        }
        break;
        
      case "options.versus.quickMatch":
        if( selectedMap ){
          controller.storage_maps.get( selectedMap, loadMapQuickPlay );
        }
        break;
        
      case "options.prevPage.small":
        setPage(cPage-1);
        break;
        
      case "options.nextPage.small":
        setPage(cPage+1);
        break;
      
      // map button
      default:
        var index = -1;
        switch( btn.getActiveData() ){
            case "1": index = 0; break;
            case "2": index = 1; break;
            case "3": index = 2; break;
            case "4": index = 3; break;
            case "5": index = 4; break;
        }
        selectIndex(index);
    }
    return this.breakTransition();
  };
});
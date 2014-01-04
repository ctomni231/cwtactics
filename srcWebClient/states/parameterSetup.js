util.scoped(function(){
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_parameter_setup_screen"),
    "cwt_panel_header_big cwt_page_button cwt_panel_button",
    "cwt_panel_header_big cwt_page_button cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button cwt_panel_button button_inactive"
  );
  
  var cPage      = 0;
  var parameters = [
    null,
    null,
    null,
    null,
    null
  ];
  
  var parameterBtn = [
    document.getElementById("options.parameter.1.value"),
    document.getElementById("options.parameter.2.value"),
    document.getElementById("options.parameter.3.value"),
    document.getElementById("options.parameter.4.value"),
    document.getElementById("options.parameter.5.value")
  ];
  
  var parameterTextBtn = [
    document.getElementById("options.parameter.1.desc"),
    document.getElementById("options.parameter.2.desc"),
    document.getElementById("options.parameter.3.desc"),
    document.getElementById("options.parameter.4.desc"),
    document.getElementById("options.parameter.5.desc")
  ];
  
  function changeValue( index, prev ){
    if( parameters[index] ){
      var def = controller.configBoundaries_[parameters[index]];
      
      if( !prev && model.cfg_configuration[parameters[index]] + def.step <= def.max ){
        model.cfg_configuration[parameters[index]] += def.step;
      } else if( model.cfg_configuration[parameters[index]] - def.step >= def.min ){
        model.cfg_configuration[parameters[index]] -= def.step;
      }
      
      updateButton(index);
    }
  }
  
  function updateButton( index ){
    parameterBtn[index].innerHTML = ( parameters[index] )? model.cfg_configuration[parameters[index]] : "&#160;";
    parameterTextBtn[index].innerHTML = ( parameters[index] )? model.data_localized(parameters[index]) : "&#160;";
  }
  
  function updateButtons(){
    var startIndex = cPage*5;
    
    // update meta data
    parameters[0] = (startIndex   < controller.configNames_.length)? controller.configNames_[startIndex  ]: null;
    parameters[1] = (startIndex+1 < controller.configNames_.length)? controller.configNames_[startIndex+1]: null;
    parameters[2] = (startIndex+2 < controller.configNames_.length)? controller.configNames_[startIndex+2]: null;
    parameters[3] = (startIndex+3 < controller.configNames_.length)? controller.configNames_[startIndex+3]: null;
    parameters[4] = (startIndex+4 < controller.configNames_.length)? controller.configNames_[startIndex+4]: null;
    
    // update UI
    updateButton(0);
    updateButton(1);
    updateButton(2);
    updateButton(3);
    updateButton(4);
  }
  
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.PARAMETER_SETUP = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.PARAMETER_SETUP.section = "cwt_parameter_setup_screen";
	
  controller.screenStateMachine.structure.PARAMETER_SETUP.enterState = function(){
    cPage = 0;
    updateButtons();
  };
  
  // ***************** D-PAD *****************
  
  controller.screenStateMachine.structure.PARAMETER_SETUP.UP = function(){
    var value = 1;
    switch( btn.getActiveKey() ){
      case "config.parameter.next":
      case "config.parameter.prev":
      case "options.nextPage":
      case "options.prevPage":
      case "options.goBack": 
      case "options.next": 
        value = 2;
        break;
    }
    
    if( value ) btn.decreaseIndex(value);
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PARAMETER_SETUP.DOWN = function(){
    var value = 1;
    switch( btn.getActiveKey() ){
      case "config.parameter.next":
      case "config.parameter.prev":
      case "options.nextPage":
      case "options.prevPage":
      case "options.goBack": 
        value = 2;
        break;
    }
    
    if( value ) btn.increaseIndex(value);
    
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PARAMETER_SETUP.LEFT = function(){
    switch( btn.getActiveKey() ){  
      case "config.parameter.next":
      case "options.nextPage":
      case "options.next": 
        btn.decreaseIndex();
        break;      
    }
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.PARAMETER_SETUP.RIGHT = function(){
    switch( btn.getActiveKey() ){
      case "config.parameter.prev":
      case "options.prevPage":
      case "options.goBack": 
        btn.increaseIndex();
        break;
    }
    return this.breakTransition();
  };
  
  // ***************** ACTIONS *****************
  
  controller.screenStateMachine.structure.PARAMETER_SETUP.CANCEL = function(){
    return "PLAYER_SETUP";
  };
  
  controller.screenStateMachine.structure.PARAMETER_SETUP.ACTION = function(){
    switch( btn.getActiveKey() ){
        
      case "config.parameter.prev":
        var value = -1;
        switch( btn.getActiveData() ){
          case "1" : value = 0; break;
          case "2" : value = 1; break;
          case "3" : value = 2; break;
          case "4" : value = 3; break;
          case "5" : value = 4; break;
        }
        changeValue(value,true);
        break;
        
      case "config.parameter.next":
        var value = -1;
        switch( btn.getActiveData() ){
          case "1" : value = 0; break;
          case "2" : value = 1; break;
          case "3" : value = 2; break;
          case "4" : value = 3; break;
          case "5" : value = 4; break;
        }
        changeValue(value,false);
        break;
        
      case "options.prevPage":
        if( cPage > 0 ){
          cPage--;
          updateButtons();
        } else return;
        break;
        
      case "options.nextPage":
        if( controller.configNames_.length > (cPage+1)*5 ){
          cPage++;
          updateButtons();
        } else return;
        break;
        
      case "options.goBack":
        return "PLAYER_SETUP";

      case "options.next":
        return "GAMEROUND";
    }
    
    return this.breakTransition();
  };
    
});
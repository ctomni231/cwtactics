controller.loadError = null;

util.scoped(function(){
  
  var elements = [
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_1),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_2),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_3),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_4),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_5),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_6)
  ];
  
  var index = -1;
  
  function changeFocus( mode, relative ){
    if( relative === undefined ) relative = true;
    
    // DROP FOCUS COLOR
    if( index !== -1 ) elements[ index ].className = "menuButton";
    
    // CHANGE INDEX
    if( relative ){
      if( mode > 0 ){
        index++;
        if( index >= elements.length ) index = 0;
      }
      else{
        index--;
        if( index < 0 ) index = elements.length-1;
      }
    }
    else{
      if( mode < 0 || mode >= elements.length ) util.raiseError("wrong index");
      index = mode;
    }
    
    // SET FOCUS COLOR
    // elements[ index ].style.background = "red";
    var vl = elements[index].attributes.key.value;
    
    if( ( !controller.loadError && vl === "VERSUS" ) || vl === "OPTIONS" ) vl = "menuButton active";
    else vl = "menuButton inactive";
    
    elements[ index ].className = vl;
      
  }
  
  function tick(){
    if( constants.DEBUG ) util.log("got click on button", elements[ index ].attributes.key.value);
  }
  
  function register(i){
    elements[i].onmouseover = function(){
      changeFocus(i,false);
    };
  }
  
  // REGISTERS MOUSE ONHOVER EVENT
  for( var i=0,e=elements.length; i<e; i++ ) register(i);
  
  // ------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.MAIN = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.MAIN.onenter = function(){
    controller.playEmptyAudio();
    controller.playMusic("BG");
    
    for( var i=0,e=elements.length; i<e; i++ ){
      elements[i].innerHTML = model.localized( elements[i].attributes.key.value );
    }
    
    if( controller.loadError ){
      var el = document.getElementById(ID_ELMT_SECTION_MAIN_ERROR);
      
      el.innerHTML = controller.loadError;
      el.style.display = "block";
      
      controller.loadError = null;
    }
    
    this.data.openSection(ID_MENU_SECTION_MAIN);
    changeFocus(1,false);
  };
  
  controller.screenStateMachine.structure.MAIN.UP = function(){
    changeFocus(-1);
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.MAIN.DOWN = function(){
    changeFocus(+1);
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.MAIN.ACTION = function(){
    var selEl = elements[index];
    var key = selEl.attributes.key.value;
    
    controller.loadError = null;
    
    if( !controller.loadError && key === "VERSUS" ) return "VERSUS";
    else if( key === "OPTIONS" ) return "OPTIONS";
      
    return this.BREAK_TRANSITION;
  };
});
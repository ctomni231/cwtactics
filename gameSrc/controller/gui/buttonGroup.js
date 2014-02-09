controller.BUTTON_GROUP_DEFAULT_STYLE       = "cwt_panel_header_big cwt_page_button cwt_panel_button";
controller.BUTTON_GROUP_DEFAULT_STYLE_ACT   = "cwt_panel_header_big cwt_page_button cwt_panel_button active";
controller.BUTTON_GROUP_DEFAULT_STYLE_INACT = "cwt_panel_header_big cwt_page_button cwt_panel_button inactive";

controller.ButtonGroup = {

  changeIndex: function( mode, relative ){
    if( relative === undefined ) relative = true;

    // DROP FOCUS COLOR
    if( this.index !== -1 ) this.elements[ this.index ].className = this.cls;

    // CHANGE INDEX
    if( relative ){
      this.index += mode;
      if( mode > 0 ){
        if( this.index >= this.elements.length ) this.index = 0;
      }
      else{
        if( this.index < 0 ) this.index = this.elements.length-1;
      }
    }
    else{
      if( mode < 0 || mode >= this.elements.length ){
        this.index = 0;
      }
      else this.index = mode;
    }

    // SET FOCUS COLOR
    if( !this.elements[ this.index ].attributes.inactive ||
       this.elements[ this.index ].attributes.inactive.value !== "true" ){
      vl = this.cls_act;
    }
    else vl = this.cls_inact;

    this.elements[ this.index ].className = vl;
  },

  increaseIndex:function( amount ){
    if( amount === void 0 ) amount = 1;
    
    this.changeIndex(amount,true);
  },

  decreaseIndex:function( amount ){
    if( amount === void 0 ) amount = -1;
    else amount = -amount;
    
    this.changeIndex(amount,true);
  },

  setIndex: function( value ){
    this.changeIndex( value, false );
  },

  isIndexInactive: function(){
    return (this.elements[ this.index ].attributes.inactive &&
            this.elements[ this.index ].attributes.inactive.value === "true");
  },

  getActiveKey: function(){
    return (this.elements[ this.index ].attributes.key.value);
  },

  getActiveData: function(){
    return (this.elements[ this.index ].attributes.data.value);
  },

  getActiveElement: function(){
    return (this.elements[ this.index ]);
  }
};

controller.registerButtonGroupHover = function(group,element,i){
  element.onmouseover = function(){
    group.setIndex(i,false);
  };
  element.onclick = function(){
    controller.screenStateMachine.event("INP_ACTION");
  };
};

controller.generateButtonGroup = function( parent, normalCls, activeCls, inactiveCls ){
  var buttonsOrig = parent.getElementsByTagName("button");
  var buttons = [];
  
  for( var i=0,e=buttonsOrig.length; i<e; i++ ){
    if( !buttonsOrig[i].attributes.ignore || buttonsOrig[i].attributes.ignore.value !== "true" ){
      buttons.push(buttonsOrig[i]);
    }
  }


  // create group
  var grp = Object.create( controller.ButtonGroup );
  grp.index = 0;
  grp.elements = buttons;

  // generate classes
  if( arguments.length === 1 ){
    normalCls = controller.BUTTON_GROUP_DEFAULT_STYLE;
    activeCls = controller.BUTTON_GROUP_DEFAULT_STYLE_ACT;
    inactiveCls = controller.BUTTON_GROUP_DEFAULT_STYLE_INACT;
  }

  grp.cls = normalCls;
  grp.cls_act = activeCls;
  grp.cls_inact = inactiveCls;

  // localize values
  for( var i=0,e=buttons.length; i<e; i++ ){
    // buttons[i].innerHTML = model.data_localized( buttons[i].attributes.key.value );
    buttons[i].className = grp.cls;
    controller.registerButtonGroupHover( grp, buttons[i], i );
  }

  grp.setIndex(0);

  return grp;
};

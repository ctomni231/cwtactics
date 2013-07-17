controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.MOBILE.onenter = function(){
  this.data.openSection(ID_ELMT_SECTION_MOBILE);
  
  var button = document.getElementById(ID_ELMT_SECTION_MOBILE_NEXT);
  button.innerHTML = model.localized( button.attributes.key.value );
};

controller.screenStateMachine.structure.MOBILE.ACTION = function(){ 
  return "MAIN"; 
};
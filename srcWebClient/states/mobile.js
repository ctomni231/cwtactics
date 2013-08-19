controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen";

controller.screenStateMachine.structure.MOBILE.enterState = function(){
  var button = document.getElementById("mobileSoundNext");
  button.innerHTML = model.localized( button.attributes.key.value );
};

controller.screenStateMachine.structure.MOBILE.ACTION = function(){ 
  return "MAIN"; 
};
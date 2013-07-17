controller.inputCoolDown = 0;

controller.updateInputCoolDown = function( delta ){
  controller.inputCoolDown -= delta;
  if( controller.inputCoolDown < 0 ) controller.inputCoolDown = 0;
}
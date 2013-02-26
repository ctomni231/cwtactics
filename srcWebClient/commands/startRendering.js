controller.engineAction({

  name:"startRendering",
  
  key:"STRE",

  action: function(){
    controller.noRendering = false;

    view.fitScreenToDeviceOrientation();
    view.completeRedraw();
  }
});
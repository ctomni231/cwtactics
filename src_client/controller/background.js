controller.background_cssEl_ = null;

// Adds an image to the background image controller. The type of the argument is an `base64` encoded
// `jpeg` image.
//
controller.background_registerAsBackground = function( base64 ){
  assert( util.isString(base64) && base64.length > 0 );

  // lazy create css
  if( !controller.background_cssEl_ ){
    controller.background_cssEl_ =  document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(controller.background_cssEl_);
  }

  // add new css for the image with inlined image content
  controller.background_cssEl_.innerHTML = ".cwt_page {"+
   "background-image: url(data:image/jpeg;base64,"+base64+");"+
   "background-repeat: no-repeat;"+
   "background-position: 0px 45px;"+
   "background-size: 100% calc(100% - 44px);"+
  "}";
};
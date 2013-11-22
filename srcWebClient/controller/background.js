// Number of possible menu images.
//
controller.background_images_ = 0;

// The base class of the main menu element.
//
controller.background_BASE_CLASS = "cwt_page";

// The class of the background element.
//
controller.background_BG_CLASS = " bg_";

// Adds an image to the background image controller.
//
controller.background_addImage = function( base64 ){
  var css = document.createElement("style");

  // add new css for the image with inlined image content
  css.innerHTML = ".cwt_page bg_"+controller.background_images_+" {"+
   "background-image: url(data:image/jpeg;base64,"+obj.value+");"+
   "background-repeat: no-repeat;"+
   "background-position: 0px 45px;"+
   "background-size: 100% calc(100% - 44px);"+
  "}";

  // increase counter
  controller.background_images_++;
  
  // register css
  document.getElementsByTagName("head")[0].appendChild(css);
};

// Sets a random image for the element by set it's class to `cwt_page bg_n` while `n` is the 
// random choosen index of the new background image.
//
controller.background_setRandomBG = function( el ){
  var newBG = parseInt( Math.random()*controller.background_images_ , 10 );
  el.class = controller.background_BASE_CLASS + controller.background_BG_CLASS + newBG;
};

controller.imgToBg = function( obj ){
  if( !obj ) return;

  var css = document.createElement("style");

  css.innerHTML = ".cwt_page {"+
	  	"background-image: url(data:image/jpeg;base64,"+obj.value+");"+
	  	"background-repeat: no-repeat;"+
	  	"background-position: 0px 45px;"+
	  	"background-size: 100% calc(100% - 44px);"+
  	"}";

  document.getElementsByTagName("head")[0].appendChild(css);
}

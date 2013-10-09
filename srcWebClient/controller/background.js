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
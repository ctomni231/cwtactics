/**
controller._soundContext = null;
window.addEventListener('load', function(){
  try {
    controller.context = new webkitAudioContext();
  }
  catch(e) {
    util.logWarn('Web Audio API is not supported in this browser');
  }
}, false);

controller._sounds = {};

controller._enabled = false;

controller.enable = function(){
  if( controller._enabled === false ){
    controller._enabled = true;
  }
};

controller.loadSound = function( key, url ){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function(){
    controller._soundContext.decodeAudioData(
      request.response, function(buffer) {

      controller._sounds[key] = buffer;
    }, null );
  };

  util.logInfo("try to load sound");
  try{
    request.send();
  }
  catch(e){
    util.logWarn("could not load sound");
    controller._enabled = -1; // NEVER ENABLE
  }
};

controller.playMusic = function( key ){

};
controller.playSfx = function( key ){
  if( controller._enabled !== true ) return;

  var buffer = controller._sounds[key];
  var source = controller._soundContext.createBufferSource();
  source.buffer = buffer;
  source.connect( controller._soundContext.destination );
  source.noteOn(0);
};
*/

createjs.Sound.registerPlugin(createjs.WebAudioPlugin);

createjs.Sound.addEventListener("loadComplete", function(){
  if( CLIENT_DEBUG ){
    util.log("finised loading sound");
  }
});

createjs.Sound.registerManifest([
  { src:"../../../sound/ok.wav", id:"ACTION" }, 
  { src:"../../../sound/cancel.wav",  id:"CANCEL" }
]);

/**
 * Plays a sound effect.
 */
controller.playSfx = function( id ){
  createjs.Sound.play( id );
};
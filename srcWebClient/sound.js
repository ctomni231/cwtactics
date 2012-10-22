sound.context = null;

sound._sounds = {};

sound.play = function( key ){
  if( sound._enabled !== true ) return;

  var buffer = sound._sounds[key];
  var source = sound.context.createBufferSource();
  source.buffer = buffer;
  source.connect( sound.context.destination );
  source.noteOn(0);
};

sound._enabled = false;

sound.enable = function(){
  if( sound._enabled === false ){
    sound._enabled = true;
//    sound.playBG("LASH");
  }
};

sound.loadSound = function( key, url ){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function(){
    sound.context.decodeAudioData( request.response, function(buffer) {
      sound._sounds[key] = buffer;

//      sound.playBG("LASH");
    }, null );
  };

  util.logInfo("try to load sound");
  try{
    request.send();
  }
  catch(e){
    util.logError("could not load sound");
    sound._enabled = -1; // NEVER ENABLE
  }
};

window.addEventListener('load', init, false);
function init() {
  try {
    sound.context = new webkitAudioContext();
  }
  catch(e) {
    util.logError('Web Audio API is not supported in this browser');
  }
}
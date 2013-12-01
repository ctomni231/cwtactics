// Storage parameter for sfx volume.
//
controller.audio_SFX_STORAGE_PARAMETER   = "volume_sfx";

// Storage parameter for music volume.
//
controller.audio_MUSIC_STORAGE_PARAMETER = "music_sfx";

// WebAudio context object.
//
controller.audio_ctx_ = false;

// Music audio node.
//
controller.audio_gainNode_music_ = null;

// SFX audio node.
//
controller.audio_gainNode_sfx_ = null;

// Initializes the audio context.
//
controller.audio_initialize = function(p,b){
  util.log("initializing audio context");

  // if audio sfx and music is deactivated then do not initialize the audio context
  if( !controller.features_client.audioSFX && !controller.features_client.audioMusic ){
    controller.audio_ctx_ = null;
    return null;
  }

  try{

    // construct new context
    if( window.AudioContext )             controller.audio_ctx_ = new window.AudioContext();
    else if ( window.webkitAudioContext ) controller.audio_ctx_ = new window.webkitAudioContext();
    else throw Error("no AudioContext constructor found");

    // construct audio nodes
    controller.audio_gainNode_sfx_            = controller.audio_ctx_.createGainNode();
    controller.audio_gainNode_sfx_.gain.value = 1;
    controller.audio_gainNode_sfx_.connect(controller.audio_ctx_.destination);
    controller.audio_gainNode_music_            = controller.audio_ctx_.createGainNode();
    controller.audio_gainNode_music_.gain.value = 0.5;
    controller.audio_gainNode_music_.connect(controller.audio_ctx_.destination);

    // load volume from config
    controller.storage_general.get( controller.audio_SFX_STORAGE_PARAMETER,function( obj ){
      if( obj ) controller.audio_gainNode_sfx_.gain.value = obj.value;
    });
    controller.storage_general.get( controller.audio_MUSIC_STORAGE_PARAMETER,function( obj ){
      if( obj ) controller.audio_gainNode_music_.gain.value = obj.value;
    });
  }
  catch(e){
    if( DEBUG ) util.log("could not grab audio context (Error:",e,")");
  }
};

// Returns a web audio context. If no context is initialized then it will be created first.
//
controller.audio_grabContext = function(){
  return controller.audio_ctx_;
};

//
//
controller.audio_buffer_ = {};

//
//
controller.audio_currentMusic_ = null;

//
//
controller.audio_currentMusicId_ = null;

//
//
controller.audio_registerAudioBuffer = function( id, buff ){
  if( DEBUG ) util.log("register",id,"in the audio cache");

  controller.audio_buffer_[id] = buff;
};

// Loads a sound into the audio system
//
controller.audio_loadByArrayBuffer = function( id, audioData, callback ){
  assert( util.isString(id) );

  if( DEBUG ) util.log("decode audio data of",id);

  controller.audio_grabContext().decodeAudioData( audioData,

    // success handling
    function(buffer) {
      controller.audio_registerAudioBuffer(id,buffer);
      if( callback ) callback(true,id);
    },

    // error handling
    function( e ){
      if( callback ) callback(false,id);
    }
  );
};

// Removes a buffer from the cache.
//
controller.audio_unloadBuffer = function( id ){
  assert( util.isString(id) );

  if( DEBUG ) util.log("de-register",id,"from the audio cache");

  delete controller.audio_buffer_[id];
};

//
//
controller.audio_isBuffered = function( id ){
  return controller.audio_buffer_.hasOwnProperty(id);
};

// Returns the value of the sfx audio node.
//
controller.audio_getSfxVolume = function(){
  if( !controller.audio_ctx_ ) return;

  return controller.audio_gainNode_sfx_.gain.value;
};

// Returns the value of the music audio node.
//
controller.audio_getMusicVolume = function(){
  if( !controller.audio_ctx_ ) return;

  return controller.audio_gainNode_music_.gain.value;
};

// Sets the value of the sfx audio node.
//
controller.audio_setSfxVolume = function( vol ){
  if( !controller.audio_ctx_ ) return;

  if( vol < 0 ) vol = 0;
  else if( vol > 1 ) vol = 1;

  controller.audio_gainNode_sfx_.gain.value = vol;
};

// Sets the value of the music audio node.
//
controller.audio_setMusicVolume = function( vol ){
  if( !controller.audio_ctx_ ) return;

  if( vol < 0 ) vol = 0;
  else if( vol > 1 ) vol = 1;

  controller.audio_gainNode_music_.gain.value = vol;
};

// Saves the configurations for the audio output.
//
controller.audio_saveConfigs = function(){

  // sfx
  if(controller.audio_gainNode_sfx_){
    controller.storage_general.set(
      controller.audio_SFX_STORAGE_PARAMETER,
      controller.audio_gainNode_sfx_.gain.value
    );
  }

  // music
  if(controller.audio_gainNode_music_){
    controller.storage_general.set(
      controller.audio_MUSIC_STORAGE_PARAMETER,
      controller.audio_gainNode_music_.gain.value
    );
  }
};

// Plays a sound effect.
//
controller.audio_playSound = function( id, loop, isMusic ){
  if( !controller.audio_ctx_ ) return;
  if( !controller.audio_buffer_[id] ) return;

  var gainNode = (isMusic)? controller.audio_gainNode_music_ : controller.audio_gainNode_sfx_;
  var source = controller.audio_ctx_.createBufferSource();

  if( loop ) source.loop = true;
  source.buffer = controller.audio_buffer_[id];
  source.connect(gainNode);
  source.noteOn(0);

  return source;
};

// Plays an empty sound buffer. Useful to initialize the audio system.
//
controller.audio_playNullSound = function(){
  if( !controller.audio_ctx_ ) return;
  var context = controller.audio_ctx_;
  var buffer  = context.createBuffer(1, 1, 22050);
  var source  = context.createBufferSource();

  source.buffer = buffer;
  source.connect(context.destination);
  source.noteOn(0);
}

// Plays a background music.
//
controller.audio_playMusic = function( id ){
  if( !controller.audio_ctx_ ) return;
  if( controller.audio_currentMusicId_ === id ) return;
  if( !controller.audio_buffer_[id] ) return;

  controller.audio_stopMusic();
  controller.audio_currentMusic_   = controller.audio_playSound(id, true, true );
  controller.audio_currentMusicId_ = id;
};

// stop existing background music.
//
controller.audio_stopMusic = function(){
  if( controller.audio_currentMusic_ ){
    controller.audio_currentMusic_.noteOff(0);
    controller.audio_currentMusic_.disconnect(0);
  }

  controller.audio_currentMusic_   = null;
  controller.audio_currentMusicId_ = null;
};
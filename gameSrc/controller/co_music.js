//
//
controller.coMusic_playLoadedMusic_ = function (_, id) {
  controller.audio_playMusic(id);
  if (view.hasInfoMessage()) view.message_closePanel(1000);
};

//
//
controller.coMusic_storeAudio_ = function (obj) {
  var audioData = Base64Helper.decodeBuffer(obj.value);
  controller.audio_loadByArrayBuffer(
    obj.key,
    audioData,
    controller.coMusic_playLoadedMusic_
  );
};

//
//
controller.coMusic_loadAudio_ = function (key) {
  controller.storage_assets.get(key, controller.coMusic_storeAudio_);
};

//
//
controller.coMusic_playCoMusic = function (id) {
  if (!id) {
    if (view.hasInfoMessage()) view.message_closePanel(1000);
    return;
  }
  
  if (!controller.audio_isBuffered(id)) {
    controller.coMusic_loadAudio_(id);
  } else {
    controller.coMusic_playLoadedMusic_(false, id);
  }
};
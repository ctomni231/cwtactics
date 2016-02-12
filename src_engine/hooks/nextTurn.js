util.scoped(function () {

  /* MOVE INTO */

  function playAudio(_, id) {
    controller.audio_playMusic(id);
  }

  function storeAudio(obj) {
    var audioData = Base64Helper.decodeBuffer(obj.value);
    controller.audio_loadByArrayBuffer(obj.key, audioData, playAudio);
  }

  function loadAudio(key) {
    controller.storage_assets.get(key, storeAudio);
  }

  /* END - MOVE INTO AUDIO */

  view.registerAnimationHook({
    key: "nextTurn_invoked",

    prepare: function () {

      var co = model.co_data[model.round_turnOwner].coA;
      if (co) {
        if (!controller.audio_isBuffered(co.music)) {
          loadAudio(co.music);
        } else {
          playAudio(false, co.music);
        }
      }
      var playerName = model.player_data[model.round_turnOwner].name || "Player " + model.round_turnOwner;
      view.showInfoMessage(model.data_localized("day") + " " + model.round_day + " - " + playerName);
    },

    render: function () {},

    update: function (delta) {},

    isDone: function () {
      return !view.hasInfoMessage();
    }

  });

});

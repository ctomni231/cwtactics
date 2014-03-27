cwt.Loading.create(function (loaderNext) {

  // skip loading when audio is not available
  if (!cwt.ClientFeatures.audioSFX && !cwt.ClientFeatures.audioMusic) {
    return;
  }

  var stuff = [];

  if (cwt.ClientFeatures.audioMusic) {

    // BACKGROUND MUSIC
    stuff.push(function(next){
      cwt.Audio.loadAudio( cwt.MenuData.music, true, next );
    });

    // ARMY
    cwt.ArmySheet.types.forEach(function (co) {
      stuff.push(function(next){
        cwt.Audio.loadAudio( cwt.ArmySheet.sheets[co].music, false, next );
      });
    });

    // CO
    cwt.CoSheet.types.forEach(function (co) {
      stuff.push(function(next){
        cwt.Audio.loadAudio( cwt.CoSheet.sheets[co].music, false, next );
      });
    });
  }

  if (cwt.ClientFeatures.audioSFX) {

    // GENERIC SOUNDS
    Object.keys(cwt.Sounds).forEach(function (sound) {
      stuff.push(function(next){
        cwt.Audio.loadAudio( cwt.Sounds[sound], true, next );
      });
    });

    // UNIT SOUNDS
    cwt.UnitSheet.types.forEach(function (co) {
      stuff.push(function(next){
        var assets = cwt.UnitSheet.sheets[co];
        callAsSequence([

          // PRIMARY WEAPON
          function (n) {
            if (assets.pri_att_sound) {
              cwt.Audio.loadAudio( assets.pri_att_sound, true, n );
            } else {
              n();
            }
          },

          // SECONDARY WEAPON
          function (n) {
            if (assets.sec_att_sound) {
              cwt.Audio.loadAudio( assets.sec_att_sound, true, n );
            } else {
              n();
            }
          }
        ], function () {
          next();
        });
      });
    });
  }

  callAsSequence(stuff, function () {
    loaderNext();
  });
});
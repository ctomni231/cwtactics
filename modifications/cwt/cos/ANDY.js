require('../../sheets').commanders.registerSheet({

  "ID": "ANDY",
  "faction": "ORST",
  "music": "music/Andy.mp3",
  "coStars": 3,
  "scoStars": 3,

  "effectMovepoints": function (value, player) {
    if (player.isPowerActive(cwt.Player.POWER_LEVEL_SCOP)) {
      return value + 1;
    } else {
      return value;
    }
  },

  "effectAttack": function (value, player) {
    if (player.isPowerActive(cwt.Player.POWER_LEVEL_SCOP)) {
      return value + 30;
    } else {
      return value;
    }
  }
});


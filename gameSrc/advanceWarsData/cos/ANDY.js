cwt.CoSheet.registerSheet({
  "ID"        : "ANDY",
  "faction"   : "ORST",
  "music"     : "Andy.mp3",
  "coStars"   : 3,
  "scoStars"  : 3,

  "effectMovepoints": function ( value, player ) {
    if( player.isPowerActive( cwt.Player.POWER_LEVEL_SCOP ) ) return value+1;
    return value;
  },

  "effectAttack": function ( value, player ) {
    if( player.isPowerActive( cwt.Player.POWER_LEVEL_SCOP ) ) return value+30;
    return value;
  }
});


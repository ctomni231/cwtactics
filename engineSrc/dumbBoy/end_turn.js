controller.ai_defineRoutine({
  key        : "endTurn",
  mapAction  : true,
  endsAiTurn : true,

  // 1 as low score to be sure that end turn will be used at last by the AI
  scoring : function( data ){
    return 1;
  },

  prepare : function( data ){
    // end turn will be done by machine
  }
});
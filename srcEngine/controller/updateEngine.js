controller.inGameRound = false;

(function(){
  
  var actionBuf = controller.actionBuffer_;
  
  var evaledChars_ = 0;
  
  /**
   * @param {Number} delta time since last update step
   */
  controller.updateState = function( delta ){
    if( !controller.inGameRound ) util.raiseError("no game round is active");
    
    // UPDATE INTERNAL TIMER
    model.updateTimer( delta );
    
    // ENDED BY TIMER ?
    if( !controller.inGameRound ) return;
    
    if( actionBuf.isEmpty()) return;

    // GET NEXT ACTION
    var data = actionBuf.pop();

    // GET REAL FUNCTION NAME
    var actionId = controller.actionMap[data[data.length - 1]];
    if( actionId === undefined ) util.raiseError("unknown or illegal model action");
    
    if (DEBUG) {
      var command = JSON.stringify(data);
      evaledChars_ += command.length;

      // REMEMBER CHAR USAGE ;)
      util.log(
        "evaluate action", command, "which is command",actionId,
        "all evaluated characters so far are", evaledChars_ 
      );
    }

    // INVOKE ACTION
    model[ actionId ].apply(model, data);
  };
    
  controller.startGameRound = function( map ){
    if( DEBUG ) util.log("start game round");
    controller.inGameRound = true;
    
    evaledChars_ = 0;
    actionBuf.clear();
    
    model.setupTimer();
    model.loadCompactModel(map);
    model.calculateNextWeather();
    model.recalculateFogMap(0);
  };
  
  controller.endGameRound = function(){
    if( DEBUG ) util.log("end game round");
    controller.inGameRound = false;
  };
  
})();
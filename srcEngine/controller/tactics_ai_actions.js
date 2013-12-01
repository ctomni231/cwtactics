// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Ai action objects. This objects works more or less like rules in a rule engine because of
// the scoring model. Every action can define a score based on the situation on the battlefield. 
// The ai does the action with the highest score first.
//

//
//
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

util.scoped(function(){

  var menu = {
    data:util.list(20,null),

    size:0,

    clear:function(){
      this.size = 0;
    },

    addEntry: function( el ){
      if( this.size === 20 ) throw Error("full");
      this.data[this.size] = el;
      this.size++;
    }
  };

  //
  //
  controller.ai_defineRoutine({
    key        : "buildCapturers",
    propAction : true,

    scoring : function( data ){
      var prid = data.source.propertyId;

      if( data.source.unit ) return -1;

      // isn't a factory
      if( !model.factory_isFactory(prid)) return -1;

      // there aren't any unit slots left or the man power is zero
      if( !model.factory_canProduceSomething(prid) ){
        if( DEBUG ) util.log("cannot build capturers because no slots left or no man power left");
      }

      menu.clear();
      model.factoryGenerateBuildMenu(prid, menu);

      // stuff buildable ?
      if( menu.size === 0 ) return -1;

      // search capturers
      var gold = model.player_data[data.source.property.owner].gold;
      for( var i=0, e=menu.size; i<e; i++ ){
        var type = model.data_unitSheets[menu.data[i]];

        // if this type is capturer, then try to build it
        // stop at the first capturer
        if( type.captures && type.cost <= gold ){
          data.action.selectedSubEntry = type.ID;

          // some scoring ideas:
          //  a) score */ number of neutral properties 
          //  b) score */ number of enemy properties in range X
          //  c) score */ distance to nearest (enemy) property

          return controller.ai_SCORE.HIGH;
        }
      }

      return -1;
    },

    prepare : function( data ){
      controller.action_objects.buildUnit.invoke(data);
    }
  });

});

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
    key        : "buildUnits",
    propAction : true,

    scoring : function( data ){
      var prid = data.source.propertyId;

      if( data.source.unit ) return -1;

      // isn't a factory
      if( !model.factory_isFactory(prid)) return -1;

      // there aren't any unit slots left or the man power is zero
      if( !model.factory_canProduceSomething(prid,model.property_data[prid].owner) ){
        if( DEBUG ) util.log("cannot build capturers because no slots left or no man power left");
        return -1;
      }

      menu.clear();
      model.factoryGenerateBuildMenu(prid, menu);

      // stuff buildable ?
      if( menu.size === 0 ) return -1;

      // search capturers
      var gold = model.player_data[data.source.property.owner].gold;
      var rand = parseInt(Math.random()*menu.size*2,10);
      var oldRand = rand;
      while(true){
        for( var i=0, e=menu.size; i<e; i++ ){
          var type = model.data_unitSheets[menu.data[i]];
          if( type.cost <= gold ){
            rand--;
            if( rand < 0 ){
              data.action.selectedSubEntry = type.ID;
              return 20;
            }
          }
        }

        // not enough money for something...
        if( rand === oldRand ) return -1;

      }

      return -1;
    },

    prepare : function( data ){
      controller.action_objects.buildUnit.invoke(data);
    }
  });

});

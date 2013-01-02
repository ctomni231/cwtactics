view.registerCommandHook({

  key: "buildUnit",

  prepare: function( data ){

    var x = data.getSourceX();
    var y = data.getSourceY();
    var unit = model.unitPosMap[x][y];
    controller.updateUnitStats( unit );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});
controller.userAction({

  name:"givePropertyToPlayer",

  key:"GPTP",

  propertyAction: true,
  hasSubMenu: true,

  /**
   * @param {controller.stateMachine.data} mem
   * @return {Boolean}
   */
  condition: function( mem ){
    var selected = mem.sourceProperty;
    if( selected === null ) return false;
    if( selected.type === "HQTR" ) return false;
    return true;
  },

  prepareMenu: function( mem ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ){
        mem.addEntry(i);
      }
    }
  },

  createDataSet: function( mem ){
    return [ mem.sourcePropertyId, mem.subAction ];
  },

  /**
   * Transfers a property of a player to an other player.
   *
   * @param {Number} pid property id
   * @param {Number} newOwner the id of the new owner
   *
   * @methodOf controller.actions
   * @name givePropertyToPlayer
   */
  action: function( pid, newOwner ){
    var prop =  model.properties[pid];
    prop.owner = newOwner;
    
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        if( model.propertyPosMap[x][y] === prop ){
          controller.pushAction( x, y, model.sheets.tileSheets[ prop.type ].vision, "RVIS" );
          return;
        }
      }
    }
  }

});
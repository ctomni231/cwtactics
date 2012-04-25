// ========================================================================
commandNode( Msg.BATTLE,

  // logic
  function( msg ){
    var attacker = map.units[ msg.attId ];
    var defender = map.units[ msg.defId ];
    var attDmg = msg.attDmg;
    var defDmg = msg.defDmg;

    // attacker attacks
    defender.hp -= attDmg;
    if( defender.hp > 0 ){

      // resists
      attacker.hp -= attDmg;

      if( attacker.hp <= 0 ){
        // attacker falls by counter
        messageContext.message({ cmd: Msg.UNIT_BUILDED, dId: msg.attId, aId: msg.defId });
      }
    }
    else{
      // falls
      messageContext.message({ cmd: Msg.UNIT_BUILDED, dId: msg.defId, aId: msg.attId });
    }
  },

  // validator
  {
    type:'object',
    properties:{
       attId: { type:'int', maximum:MAX_PLAYER*MAX_UNITS-1, minimum:0, required:true },
       defId: { type:'int', maximum:MAX_PLAYER*MAX_UNITS-1, minimum:0, required:true },
      attDmg: { type:'int', minimum:0, required:true },
      defDmg: { type:'int', minimum:0, required:true }
    }
  }
);

// ========================================================================
commandNode( Msg.SILO_FIRE,

  function( msg ){

  },

  // validator
  {

  }
);
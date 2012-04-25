commandNode( Msg.UNIT_BUILDED ,

  function( msg ){
    var player = msg.pId;
    var type = msg.type;
    var prop = msg.propId;
    var uid = map.receiveUnit();
    var unit = map.units[uid];
    var sheet = sheets.units[type];

    // set properties
    unit.hp = 99;
    unit.owner = player;
    unit.type = type;
    unit.ammo = sheet.maxAmmo;
    unit.fuel = sheet.maxFuel;
    unit.weight = sheet.weight;

    map[msg.x][msg.y].unit = uid;
  },

  // validator
  {
    properties:{
      pId: map.playerIdValidator
    }
  }
);
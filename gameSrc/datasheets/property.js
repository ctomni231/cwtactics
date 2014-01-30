cwt.PropertySheet = my.Class(cwt.SheetDatabase,{

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.PropertySheet.registerSheet(this);
  }
});

  model.data_movetypeParser.parse({
    "ID"    : "NO_MOVE",
    "sound" : null,
    "costs" : {
        "*" : -1
    }
  });

  model.data_unitParser.parse({
    "ID"       : "CANNON_UNIT_INV",
    "cost"     : 0,
    "range"    : 0,
    "movetype" : "NO_MOVE",
    "vision"   : 1,
    "fuel"     : 0,
    "ammo"     : 0,
    "assets"   : {}
  });

  model.data_unitParser.parse({
    "ID"       : "LASER_UNIT_INV",
    "cost"     : 0,
    "range"    : 0,
    "movetype" : "NO_MOVE",
    "vision"   : 1,
    "fuel"     : 0,
    "ammo"     : 0,
    "assets"   : {}
  });

  model.data_tileParser.parse({
    "ID"            : "PROP_INV",
    "defense"       : 0,
    "vision"        : 0,
    "capturePoints" : 1,
    "blocker"       : true,
    "assets"        : {}
  });
};

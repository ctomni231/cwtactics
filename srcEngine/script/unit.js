(function(){

  var tags = {
    vehicle:false,
       tank:false,
       foot:false,
        air:false,
      naval:false
  };
  
  controller.script.registerTagsSolver( "unitValueResolver", 
  function(unit) {
    var unitSh = model.sheets.unitSheets[ unit.type ];
    var movetype = unitSh.moveType;
    
    // MOVE TYPE
    tags.vehicle = ( movetype === "MV_TIRE_A" || movetype === "MV_TIRE_B"  );
    tags.tank = ( movetype === "MV_TANK"  );
    tags.foot = ( movetype === "MV_INFANTRY" || movetype === "MV_MECH"  );
    tags.air = ( movetype === "MV_AIR"  );
    tags.naval = ( movetype === "MV_SHIP" || movetype === "MV_WATER_TRANSPORT"  );
    
    // FIRE TYPE
    var mainWp = model.sheets.weaponSheets[ unitSh.mainWeapon ];
    tags.direct = (mainWp !== undefined && mainWp.minRange === 1);
    tags.indirect = !tags.direct;
    
    return tags;
  });
  
})();
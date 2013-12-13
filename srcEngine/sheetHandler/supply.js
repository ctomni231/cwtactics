model.supply_parseRepair_ = function( sheet ){
  var keys,i;
  if( sheet.repairs ){

    keys = Object.keys(sheet.repairs);
    i    = keys.length;
    while( i-- ){
      assertIntRange( sheet.repairs[keys[i]],1,9 );
    }
  }
};

model.event_on("parse_unit",function( sheet ){
  var keys,i;

  if( sheet.supply ){
    i = sheet.supply.length;
    while( i-- ){
      assertStr( sheet.supply[i] );
    }
  }

  model.supply_parseRepair_(sheet);
});

model.event_on("parse_tile",model.supply_parseRepair_);

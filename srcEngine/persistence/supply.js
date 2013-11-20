model.supply_parseRepair_ = function( sheet ){
  var keys,i;
  if( !util.isUndefined(sheet.repairs) ){

    keys = Object.keys(sheet.repairs);
    i    = keys.length;
    while( i-- ){
      assert( util.intRange(sheet.repairs[keys[i]],1,9) );
    }
  }
};

model.data_unitParser.addHandler(function(sheet){
  var keys,i;

  if( !util.isUndefined(sheet.supply) ){
    i    = sheet.supply.length;
    while( i-- ){
      assert( util.isString(sheet.supply[i]) );
    }
  }

  model.supply_parseRepair_(sheet);
});

model.data_tileParser.addHandler(model.supply_parseRepair_);
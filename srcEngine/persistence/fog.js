model.data_unitParser.addHandler(function(sheet){
  assert(util.intRange(sheet.vision,1,MAX_SELECTION_RANGE));
});

model.data_tileParser.addHandler(function(sheet){
  assert(util.intRange(sheet.vision,0,MAX_SELECTION_RANGE));
});
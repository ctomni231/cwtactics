model.unitTypeParser.addHandler(function(sheet){
  assert(util.intRange(sheet.vision,1,MAX_SELECTION_RANGE));
});

model.tileTypeParser.addHandler(function(sheet){
  assert(util.intRange(sheet.vision,0,MAX_SELECTION_RANGE));
});
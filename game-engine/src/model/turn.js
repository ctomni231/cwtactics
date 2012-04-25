map.currentPlayer = -1;
map.currentDay = 1;
map.leftActors = [];

map.canAct = function( unit ){
  if( typeof unit === 'number' ) unit = Unit.byId(unit);

  return map.leftActors.indexOf(unit) !== -1;
};
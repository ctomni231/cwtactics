
(function(){

  

  //
  //
  model.event_on( "explode_invoked",function( tx, ty, range, damage, owner ){
    model.map_doInRange(tx, ty, range, explDam, damage);
  });

})();

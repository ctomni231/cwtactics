(function(){

  var tags = {
    factory:false
  };
  
  controller.script.registerTagsSolver( "propertyValueResolver", 
  function( property ) {
    var tileSh = model.sheets.tileSheets[ property.type ];
    
    tags.factory = ( tileSh.builds );
    
    return tags;
  });
  
})();
controller.infoPanelRender_ = {

  tile: function( x,y, unit, property, row, left, right ){
    left.innerHTML = util.i18n_localized(model.map[x][y]);
  },
  
  defense: function( x,y, unit, property, row, left, right ){
    left.innerHTML = util.i18n_localized("defense");
    right.innerHTML = model.sheets.tileSheets[ model.map[x][y] ].defense;
  },
  
  property: function( x,y, unit, property, row, left, right ){
    if( !model.fogData[x][y] ) property = null;
    
    row.style.display = (property !== null)? "table-row": "none";
    if( property === null ) return;
    
    left.innerHTML = util.i18n_localized( property.type );
  },
  
  capturePoints: function( x,y, unit, property, row, left, right ){
    if( !model.fogData[x][y] ) property = null;
    
    row.style.display = (property !== null)? "table-row": "none";
    if( property === null ) return;
    
    left.innerHTML = util.i18n_localized("capturePoints");
    right.innerHTML = property.capturePoints;
  },
  
  unit: function( x,y, unit, property, row, left, right ){
    if( !model.fogData[x][y] ) unit = null;
    
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized( unit.type );
  },
  
  hp: function( x,y, unit, property, row, left, right ){
    if( !model.fogData[x][y] ) unit = null;
    
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized("health");
    right.innerHTML = (parseInt( unit.hp/10,10)+1);
  },
  
  ammo: function( x,y, unit, property, row, left, right ){
    if( !model.fogData[x][y] ) unit = null;
    
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized("ammo");
    right.innerHTML = unit.ammo;  
  },
  
  fuel: function( x,y, unit, property, row, left, right ){
    if( !model.fogData[x][y] ) unit = null;
    
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized("fuel");
    right.innerHTML = unit.fuel;  
  }
};

controller.infoPanelRenderComponents_ = {
  empty:true
};

// RENDERS THE INFORMATION PANEL IN THE MENU
controller.registerMenuRenderer("__infoPanel__",function( x,y, entry ){
  
  // COLLECT
  if( controller.infoPanelRenderComponents_.empty ){
    var table = document.getElementsByName("cwt_menu_header_table")[0];
    //var rows = table.getElementsByTagName("tr");
    var rows = table.children[0].children;
    for( var i=0,e=rows.length; i<e; i++ ){
        
      var row = rows[i];
      // var columns = row.getElementsByTagName("td");
      var columns = row.cells;
      
      if( columns.length !== 2 ) util.raiseError();
      
      controller.infoPanelRenderComponents_[ row.attributes.name.value ] = [
        row,
        columns[0], columns[1]
      ];
    }
    
    delete controller.infoPanelRenderComponents_.empty;
  }
  
  var keys = Object.keys( controller.infoPanelRenderComponents_ );
  for( var i=0,e=keys.length; i<e; i++ ){
    
    var key = keys[i];
    var renderFn = controller.infoPanelRender_[key];
    var renderEl = controller.infoPanelRenderComponents_[key];
    
    var unit = model.unitPosMap[x][y];
    var property = model.propertyPosMap[x][y];
    
    if( renderFn === undefined ) continue;
    
    renderFn( x,y, unit, property, renderEl[0],renderEl[1],renderEl[2] );
  }
});
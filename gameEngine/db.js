var db$_final = false;
var db$_sheetKeys = {};     // holds all id data <str,int>
var db$_sheetData = [];     // holds all sheets <int,object>

/**
 * Checks an unit sheet and throws an ExpectFailedError if an assertment
 * fails.
 *
 * @function 
 * @param {Object} data
 */
function db$_checkUnitSheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db$_sheetKeys );

    // some checks @TODO movetype sheet check
    expect( data.moveType ).isString().isPropertyOf( db$_sheetKeys );                                                                           
    expect( data.moveRange ).isInteger().gt(0);
}

function db$_checkMoveTypeSheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db$_sheetKeys );

    // some checks
    // @TODO fix it
    //expect( data.costs ).isMap().key.isString().not.isEmpty().value.isInt();
}

function db$_checkTileSheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db$_sheetKeys );

    // some checks
    expect( data.defense ).isInteger().ge(0);
}

function db$_checkPropertySheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db$_sheetKeys );

    // some checks
    expect( data.capturePoints ).isInteger().gt(0);
}


var db$SheetType = collection$enum("UNIT","TILE","PROPERTY","MOVETYPE");

/**
 * Parses a sheet and adds it to the database.
 *
 * @function
 * @name parseSheet
 * @memberOf db
 */
function db$parseSheet(data,type){

    if( db$_final === true ) throw Error("database is already finalized");

    if( type === "UNIT" ){
        db$_checkUnitSheet( data );
    }
    else if( type === "PROPERTY" ){
        db$_checkPropertySheet( data );
    }
    else if( type === "MOVETYPE" ){
        db$_checkMoveTypeSheet( data );
    }
    else if( type === "TILE" ){
        db$_checkTileSheet( data );
    }
    else throw Error("unknown sheet '"+type+"'");

    db$_sheetData[ db$_registerId( data.ID ) ] = data;
    delete data.ID; // remove duplicate data
}

function db$finalize(){ 
    db$_final = true; 
}

/**
 * Registers an sheetID and returns its corresponding integer id.
 * 
 * @param {string} sheetId
 */
function db$_registerId( sheetId ){
    
    var nextSheetId = 0;
    for( var key in db$_sheetKeys ) if( db$_sheetKeys.hasOwnProperty(key) ) nextSheetId++;
    
    db$_sheetKeys[ sheetId ] = nextSheetId;
    return nextSheetId;
}

/**
 * Returns a sheet by its id.
 */
function db$sheet( id ){
    
    // get int id from data object if necessary
    if( typeof id === 'string' ){
	 id = db$_sheetKeys[id];
    }
    
    if( TYPED ) expect(id).isInteger();
    if( DEBUG ){
        var numOfSheets = 0;
        //TODO check sheet
        for( var key in db$_sheetData ) if( db$_sheetData.hasOwnProperty(key) ) numOfSheets++;
        expect(id).ge(0).lt(numOfSheets); 
    }
    
    return db$_sheetData[id];
}

event$listen("debug_printStatus", function(){
    
    //TODO print nicer output
    log$info("==Database==");
    
    log$info("  Keys:");
    for( var key in db$_sheetKeys ) log$info("    Key:"+key+" ID:"+db$_sheetKeys[key]);
    
    log$info("  Sheets:");
    for( var i in db$_sheetData ) log$info("    ID:"+i+" Sheet:"+db$_sheetData[i]);
});
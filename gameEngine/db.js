var db__final = false;
var db__sheetKeys = {};     // holds all id data <str,int>
var db__sheetData = [];     // holds all sheets <int,object>

/**
 * Checks an unit sheet and throws an ExpectFailedError if an assertment
 * fails.
 *
 * @function 
 * @param {Object} data
 */
function db__checkUnitSheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db__sheetKeys );

    // some checks @TODO movetype sheet check
    expect( data.moveType ).isString().isPropertyOf( db__sheetKeys );                                                                           
    expect( data.moveRange ).isInteger().gt(0);
}

function db__checkMoveTypeSheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db__sheetKeys );

    // some checks
    // @TODO fix it
    //expect( data.costs ).isMap().key.isString().not.isEmpty().value.isInt();
}

function db__checkTileSheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db__sheetKeys );

    // some checks
    expect( data.defense ).isInteger().ge(0);
}

function db__checkPropertySheet( data ){

    expect( data.ID ).isString().not.isPropertyOf( db__sheetKeys );

    // some checks
    expect( data.capturePoints ).isInteger().gt(0);
}


var db_SheetType = collection_enum("UNIT","TILE","PROPERTY","MOVETYPE");

/**
 * Parses a sheet and adds it to the database.
 *
 * @function
 * @name parseSheet
 * @memberOf db
 */
function db_parseSheet(data,type){

    if( db__final === true ) throw Error("database is already finalized");

    if( type === "UNIT" ){
        db__checkUnitSheet( data );
    }
    else if( type === "PROPERTY" ){
        db__checkPropertySheet( data );
    }
    else if( type === "MOVETYPE" ){
        db__checkMoveTypeSheet( data );
    }
    else if( type === "TILE" ){
        db__checkTileSheet( data );
    }
    else throw Error("unknown sheet '"+type+"'");

    db__sheetData[ db__registerId( data.ID ) ] = data;
    delete data.ID; // remove duplicate data
}

function db_finalize(){ 
    db__final = true; 
}

/**
 * Registers an sheetID and returns its corresponding integer id.
 * 
 * @param {string} sheetId
 */
function db__registerId( sheetId ){
    
    var nextSheetId = 0;
    for( var key in db__sheetKeys ) if( db__sheetKeys.hasOwnProperty(key) ) nextSheetId++;
    
    db__sheetKeys[ sheetId ] = nextSheetId;
    return nextSheetId;
}

/**
 * Returns a sheet by its id.
 */
function db_sheet( id ){
    
    // get int id from data object if necessary
    if( typeof id === 'string' ){
	 id = db__sheetKeys[id];
    }
    
    if( TYPED ) expect(id).isInteger();
    if( DEBUG ){
        var numOfSheets = 0;
        //TODO check sheet
        for( var key in db__sheetData ) if( db__sheetData.hasOwnProperty(key) ) numOfSheets++;
        expect(id).ge(0).lt(numOfSheets); 
    }
    
    return db__sheetData[id];
}

event_listen("debug_printStatus", function(){
    
    //TODO print nicer output
    log_info("==Database==");
    
    log_info("  Keys:");
    for( var key in db__sheetKeys ) log_info("    Key:"+key+" ID:"+db__sheetKeys[key]);
    
    log_info("  Sheets:");
    for( var i in db__sheetData ) log_info("    ID:"+i+" Sheet:"+db__sheetData[i]);
});
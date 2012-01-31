// ------ UNITS ------

/**
 * Resets an unit object back to a clean state.
 */
function model_resetUnit( unit, sheet ){
    if( DEBUG ){ 
        log$info("reset unit instance");
        expect( unit ).isStruct('Unit');
        expect( sheet ).isStruct('UnitSheet');
    }
    
    unit.hp = 99;
    unit.ammo = sheet.maxAmmo;
    unit.fuel = sheet.maxFuel;
    unit.exp = 0;
    
    // delete transport object [@WAITS BETA-1]
}


// -------- PROPERTY ----------

/**
 * Resets a property object back to a clean state.
 */
function model_resetProperty( property, sheet ){
    if( DEBUG ){
        log$info("reset property instance");
        expect( property ).isStruct('Property');
    }
    
    property.capturePoints = sheet.capturePoints;
    property.owner = null;
}


// -------- PLAYER ---------

/**
 * Resets a player object back to a clean state.
 */
function model_resetPlayer( player ){
    if( DEBUG ){
        log$info("reset player instance");
        expect( player ).isStruct('Player');
    }
    
    player.name = "";
    player.gold = 0;
    player.team = 0;
    if( !neko.isDef( player.units ) ) player.units = [];
    else player.units.clear(); //TODO: maybe clear his units? not clear array!
}


// ----------- GAME AND MAP DATA ----------

var game_map = collection_matrix( MAX_MAP_LENGTH );
var game_map_width;
var game_map_height;
var game_map_properties = {};   // object<position,property>
var game_map_units = {};        // object<position,unit>

var game_round_day;
var game_round_turn;
var game_round_players = collection_fixedStructArray('Player', MAX_PLAYER );
var game_round_leftActors = [];
var game_round_activePlayerID;

/**
 * Loads a map file and saves it's content into the map objects.
 */
function game_loadMap( data ){
    if( DEBUG ) log_info("loading "+data.name+" map into game model");
    
    game_map_height = data.height;
    game_map_width = data.width;

    // set player data

    // fill map with filler
    var filler = data.filler;
    collection_each( game_map , function(el,x,y,matrix){
        matrix[x][y] = filler;
    });
    
    // place tiles
    collection_each(data.tiles, function( tileDesc ){
        if( DEBUG ){
            expect(tileDesc.y).isInteger().ge(0);
            expect(tileDesc.x).isInteger().ge(0);
        }
        
        game_map[tileDesc.x][tileDesc.y] = tileDesc.id;
        
        if( tileDesc.owner ){
            if( TYPED ) expect(tileDesc.owner).isInteger().ge(0);
        }
    });
    
    log_info("reset game round meta data");
    
    // reset metadata 
    game_round_day = 0;
    game_round_turn = 0;
    game_round_activePlayerID = 0;
    
    // reset players
    collection_each( game_round_players, function( el ){
        model_resetPlayer(el);
    });
    
    collection_clear( game$round$leftActors );
    
    if( DEBUG ) log_info("loading map complete");
}

function game_distance( objA, objB ){
    
    // get positions
    
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}


// ---------- SAVE EVENTS -------------

event_listen("saveGame",function(){
    neko_error_notImplementedYet();
});

event_listen("loadGame",function(){
    neko_error_notImplementedYet();
});


// ---------- DEBUG PRINTING ------------

event_listen("debug_printStatus", function(){
    
    log_info("==Map==");    
    log_info("Tiledata:"+game_map);
    log_info("Units:"+game_map_units);
    log_info("Map-Width:"+game_map_width);
    log_info("Map-Height:"+game_map_height);
    log_info("Property:"+game_map_properties);
    
    log_info("==Game Round==");
    log_info("Day:"+game_round_day);
    log_info("Turn:"+game_round_turn);
    log_info("Active Player:"+game_round_activePlayerID);
    log_info("Left Actors:"+game_round_leftActors);
});
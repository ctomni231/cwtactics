function Unit(){}

function resetUnit( unit, sheet ){
    if( TYPED ) expect( arguments ).typedList( Unit, UnitSheet );
    
    unit.hp = 99;
    unit.ammo = sheet.maxAmmo;
    unit.fuel = sheet.maxFuel;
    unit.exp = 0;
    
    // delete transport object
    if( neko.isDef(unit.transport) ) delete unit.transport;
}

function objects_isTransporter( unit ){
    if( TYPED );
    
    return typeof unit !== 'undefined';
}

function getLoadedWeight( unit ){
    if( TYPED );
    
    var l = 0;
    for( var i in unit.transport ) l += unit.transport[i].sheet().weight;
    
    return l;
}

function loadUnit( transport, load ){
    if( TYPED );
    
    if( !isTransporter(transport) ) neko.error(transport+' is not a transporter');
    transport.transport.put( load );
}

// END OF UNIT SECTOR

function Property(){}

function resetProperty( property, sheet ){
    if( TYPED ) expect( arguments ).typedList( Property, PropertySheet );
    
    property.capturePoints = sheet.capturePoints;
    property.owner = null;
}

// END OF PROPERTY SECTOR

function Player(){}

function resetPlayer( player ){
    player.name = "";
    player.gold = 0;
    player.team = 0;
    if( !neko.isDef( player.units ) ) player.units = [];
    else player.units.clear(); //TODO: maybe clear his units? not clear array!
}


/**
 * true if at least two players alive, that are not members of the same team.
 */
function game_atLeastTwoEnemyPlayerAlive(){
    var r = null;
    for( var i = 0; i < map.players.length ; i++ ){
      if( r == null ) r = map.players[i].team;
      else if( map.players[i] !== r ) return true;
    }
    return false;
}

function objects_isPlayerAlive( player ){
    return player.team !== game_round_playerLoosed;
}

var game_round_playerLoosed = -1;


/* ************************************************** */
/* map and game model with all necessary map objects. */
/* ************************************************** */

var game_map = [];
var game_map_width = 0;
var game_map_height = 0;
var game_map_properties = {};   // object<position,property>
var game_map_units = {};        // object<position,unit>

var game_round_day = null;
var game_round_turn = null;
var game_round_players = null;
var game_round_leftActors = null;
var game_round_activePlayerID = null;

/**
 * Loads a map file and saves it's content into the map objects.
 */
function game_loadMap( data ){
    
    game_map_height = data.height;
    game_map_width = data.width;

    // set player data

    // fill map with filler
    var filler = data.filler;
    collection_eachInRange(game_map,0,data.width*data.height,function(el,index,array){ 
        array[index] = filler;
    });
    
    // place tiles
    collection_each(data.tiles, function( tileDesc ){
        if( TYPED ) expect(tileDesc.x,tileDesc.y).isInteger().ge(0);
        
        game_map[tileDesc.y*game_map_width+tileDesc.x] = tileDesc.id;
        
        if( tileDesc.owner ){
            if( TYPED ) expect(tileDesc.owner).isInteger().ge(0);
        }
    });
    
    // reset metadata 
    game_round_day = 0;
    game_round_turn = 0;
    game_round_activePlayerID = 0;
}

function game_indexToPosX( index ){
    return index % game_map_width;
}

function game_indexToPosY( index ){
    return (index -(index % game_map_width)) / game_map_height;
}

function game_distance( tileA, tileB ){ //@TODO support units as argument too
    
    var x1 = game_indexToPosX(tileA);
    var y1 = game_indexToPosY(tileA);
    var x2 = game_indexToPosX(tileB);
    var y2 = game_indexToPosY(tileB);
    
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}


/* SYSTEM EVENTS
 ****************/

event_listen("saveGame",function(){
    // not implemented yet
});

event_listen("loadGame",function(){
    // not implemented yet
});

event_listen("debug_printStatus", function(){
    
    log_info("==Map==");
    log_info("Map-Width:"+game_map_width);
    log_info("Map-Height:"+game_map_height);
    log_info("Tiledata:"+game_map);
    log_info("Property:"+game_map_properties);
    log_info("Units:"+game_map_units);
    
    log_info("==Game Round==");
    log_info("Day:"+game_round_day);
    log_info("Turn:"+game_round_turn);
    log_info("Active Player:"+game_round_activePlayerID);
    log_info("Left Actors:"+game_round_leftActors);
});
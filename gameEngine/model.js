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

function objects$isTransporter( unit ){
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
function game$atLeastTwoEnemyPlayerAlive(){
    var r = null;
    for( var i = 0; i < map.players.length ; i++ ){
      if( r == null ) r = map.players[i].team;
      else if( map.players[i] !== r ) return true;
    }
    return false;
}

function objects$isPlayerAlive( player ){
    return player.team !== game$round$playerLoosed;
}

var game$round$playerLoosed = -1;


/* ************************************************** */
/* map and game model with all necessary map objects. */
/* ************************************************** */

var game$map = [];
var game$map$width = 0;
var game$map$height = 0;
var game$map$properties = {};   // object<position,property>
var game$map$units = {};        // object<position,unit>

var game$round$day = null;
var game$round$turn = null;
var game$round$players = null;
var game$round$leftActors = null;
var game$round$activePlayerID = null;

/**
 * Loads a map file and saves it's content into the map objects.
 */
function game$loadMap( data ){
    
    game$map$height = data.height;
    game$map$width = data.width;

    // set player data

    // fill map with filler
    var filler = data.filler;
    collection$eachInRange(game$map,0,data.width*data.height,function(el,index,array){ 
        array[index] = filler;
    });
    
    // place tiles
    collection$each(data.tiles, function( tileDesc ){
        if( TYPED ) expect(tileDesc.x,tileDesc.y).isInteger().ge(0);
        
        game$map[tileDesc.y*game$map$width+tileDesc.x] = tileDesc.id;
        
        if( tileDesc.owner ){
            if( TYPED ) expect(tileDesc.owner).isInteger().ge(0);
        }
    });
    
    // reset metadata 
    game$round$day = 0;
    game$round$turn = 0;
    game$round$activePlayerID = 0;
}

function game$indexToPosX( index ){
    return index % game$map$width;
}

function game$indexToPosY( index ){
    return (index -(index % game$map$width)) / game$map$height;
}

function game$distance( tileA, tileB ){ //@TODO support units as argument too
    
    var x1 = game$indexToPosX(tileA);
    var y1 = game$indexToPosY(tileA);
    var x2 = game$indexToPosX(tileB);
    var y2 = game$indexToPosY(tileB);
    
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}


/* SYSTEM EVENTS
 ****************/

event$listen("saveGame",function(){
    // not implemented yet
});

event$listen("loadGame",function(){
    // not implemented yet
});

event$listen("debug_printStatus", function(){
    
    log$info("==Map==");
    log$info("Map-Width:"+game$map$width);
    log$info("Map-Height:"+game$map$height);
    log$info("Tiledata:"+game$map);
    log$info("Property:"+game$map$properties);
    log$info("Units:"+game$map$units);
    
    log$info("==Game Round==");
    log$info("Day:"+game$round$day);
    log$info("Turn:"+game$round$turn);
    log$info("Active Player:"+game$round$activePlayerID);
    log$info("Left Actors:"+game$round$leftActors);
});
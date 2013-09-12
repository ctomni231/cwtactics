// full featured mod file for testing
// maybe outdated
//  --> copied from awds mod

var evalAllCommands = function(){
	while( !controller.actionBuffer_.isEmpty() ){
		controller.updateState(0);
	}
};

var globalModification_ = {
	language:{
		"test":"This is a test"
	},
	tiles:[],
	units:[]
};

var globalModification = function(){
	return Object.create( globalModification_ );
};

var emptyMap = function(w,h,filler){
	var map = {};
	
	// set meta data
	map.mapWidth 	= w;
	map.mapHeight = h;
	map.typeMap 	= [ filler ];
	map.map 			= [];
  
	// fill map with filler tile type
	var x,y;
  for( x=0; x<w; x++ ){
		map.map[x] = [];
		for( y=0; y<h; y++ ){
			map.map[x][y] = 0;
		}
	}
	
	return map;
};
var CTR_TEST_MPW = 10;
var CTR_TEST_MPH = 10;
var CTR_TEST_FILLER = "TILE_A";

module("game controller tests", { setup: function(){
	controller.loadModification( globalModification() );
	controller.loadCompactModel( emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER) );
}};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			 
test("map loading with filler has only filler tiles", function(){
	is( model.mapHeight, CTR_TEST_MPH, "map height should be the same as CTR_TEST_MPH");
	is( model.mapWidth, CTR_TEST_MPW, "map height should be the same as CTR_TEST_MPW");
	
	var x,y;
	var onlyFillers = true;
  for( x=0; x<model.mapWidth; x++ ){
		for( y=0; y<model.mapHeight; y++ ){
			if( model.map[x][y].ID !== CTR_TEST_FILLER ) onlyFillers = false;
		}
	}
	equal( onlyFillers, true ,"should be only fillers on map");
});

test("place some special tiles", function(){
	var map = emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER);
	map.map[1][1] = "XXX";
	map.map[4][4] = "YYY";
	
	controller.loadCompactModel( map );
	
	equal( model.map[1][1], "XXX", "first special tile was set" );
	equal( model.map[4][4], "YYY", "second special tile was set" );
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

test("events are definable", function(){
	controller.defineEvent("XXX");
	notNull( controller.events.XXX , "XXX should be placed in controller.events" );
	controller.events.XXX = null;
});

test("events are not definable twice", function(){
	controller.defineEvent("XXX");
	trowsError( function(){ controller.defineEvent("XXX"); },"second attempt should throw an error");
	controller.events.XXX = null;
});

test("events are listenable", function(){
	var imTrue = false;
	
	controller.defineEvent("XXX");
	controller.onEvent("XXX", function(){ 
		imTrue = true;
	});
	
	is( imTrue, true, "callback should be called" );
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

test("saving custom map should work at runtime", function(){
	var result = controller.saveCompactModel();
	equal( result, JSON.stringify(emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER)) );
});

test("loading custom map with explicit game data should work at runtime", function(){
	
});

test("loading custom map with illegal map sizes should not work", function(){
	var map = emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER);
	
	map.mapHeight = -10;
	map.mapWidth = 21421323;
	
	trowsError( function(){ 
		controller.loadCompactModel(map);
  },"map load should throw an error");
});

test("loading custom map with illegal map tiles should not work", function(){
	var map = emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER);
	
	map.map[1][2] = 40;
	
	trowsError( function(){ 
		controller.loadCompactModel(map);
  },"map load should throw an error");
});

test("loading custom map with illegal map tile types should not work", function(){
	var map = emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER);
	
	map.typeMap[0] = "I_AM_NOT_A_VALID_TILE_TYPE";
	
	trowsError( function(){ 
		controller.loadCompactModel(map);
  },"map load should throw an error");
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

test("place some special tiles", function(){

});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module("game commands test", { setup: function(){
	controller.loadModification( globalModification() );
	
	var map = emptyMap(CTR_TEST_MPW,CTR_TEST_MPH,CTR_TEST_FILLER);
	
	map.properties = [
		[0,1,1,"SOLDIER_FACTORY",20,0] 
	];
	
	controller.loadCompactModel( map );
}}; 
		
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// WAIT ACTION
			 
test("wait should work on units that can act",function(){

});

test("wait should not work on units that cannot act",function(){

});

test("wait should work on units that moves onto a free tile",function(){

});

test("wait should not work when try to moving on an occupied tile",function(){
	
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// BUILD ACTION

test("you can build on factories when obtain it",function(){

});

test("you cannot build on factories when you don't obtain it",function(){

});

test("you cannot build without man power",function(){

});

test("you cannot build without money",function(){

});

test("you can only build factory specific types",function(){

});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
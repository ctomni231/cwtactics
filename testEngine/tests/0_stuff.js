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
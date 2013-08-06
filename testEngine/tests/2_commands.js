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
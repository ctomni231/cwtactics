window.notNull = function( obj, message ){
  ok( obj !== null, message );
};

window.isNull = function( obj, message ){
  ok( obj === null, message );
};

window.is = function( left, right , message ){  
  deepEqual( left, right, message );
};

window.ge = function( left, right , message ){
  if( message === undefined ) message = left+" is greater equals "+right;
  
  ok( left >= right, message );
};

window.gt = function( left, right , message ){
  if( message === undefined ) message = left+" is greater then "+right;
  
  ok( left > right, message );
};

window.le = function( left, right , message ){
  if( message === undefined ) message = left+" is lower equals "+right;
  
  ok( left <= right, message );
};

window.lt = function( left, right , message ){
  if( message === undefined ) message = left+" is lower then "+right;
  
  ok( left < right, message );
};

window.hasKey = function( obj, prop , message ){
  if( message === undefined ) message = "object has key "+prop;
  
  ok( obj.hasOwnProperty(prop), message );
};

window.hasKeys = function( obj , message ){
  if( message === undefined ) message = "object is populated";
  
  ok( Object.keys(obj).length > 0, message );
};

window.throwsError = function( fn , message ){
  if( message === undefined ) message = "call should throw an error";
  
  try {
    fn();
    ok( false , message );
  }
  catch( e ){ 
    ok( true , message ); 
  }
};
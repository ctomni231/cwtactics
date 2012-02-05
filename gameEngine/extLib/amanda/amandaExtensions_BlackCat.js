// custom amanda validators

// number between
amanda.addValidator('between', function(property, propertyValue, validator, propertyValidators, callback) {

  var left = validator[0]+1;
  var right = validator[1]-1;
  if( validator[2] ){
      left--;
      right++;
  }

  if( propertyValue >= left && propertyValue <= right ) return callback();
  
  return callback("value should be greater equals "+left+" and lower equals "+right+", but is "+propertyValue);
});

// is integer
amanda.addValidator('integer', function(property, propertyValue, validator, propertyValidators, callback) {
  return ( validator === true && propertyValue % 2 == 0 )? callback() : callback("value is not an integer");
});

// property of
amanda.addValidator('propertyOf', function(property, propertyValue, validator, propertyValidators, callback) {
  return ( typeof validator[propertyValue] !== 'undefined' )? 
            callback() : callback("is not a property of the given object");
});
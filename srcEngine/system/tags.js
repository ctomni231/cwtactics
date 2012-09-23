/**
 *
 */
cwt.createTagContainer = function() {
  var ct;
  return ct = {
    nodes: []
  };
};



/**
 *
 */
cwt.solveTagAttribute = function( value, nodes ) {
  for( var i = 0; i<nodes.length; i++ ){
    value= cwt._tagCodes[ nodes[i].a ]( value, nodes[i] );
  }

  return value;
};

/**
 * @private
 */
cwt._tagCodes = {};

cwt._tagCodes.FOR_DAYS = function(value, tagDes) {
  if(cwt.day < tagDes.lastDay){
    return null;
  }
  else {
    return value;
  }
};

cwt._tagCodes.TWICE = function(value, tagDes) {
  return cwt.solveTagAttribute( value, tagDes.commands )+cwt.solveTagAttribute( value, tagDes.commands )-value;
}

cwt._tagCodes.CONDITION = function(value, tagDesc) {
  if( tagDesc.cond === 1 ){
    return tagDesc.thenBlock;
  } else {
    return tagDesc.elseBlock;
  }
};

cwt._tagCodes.CHANGE_VALUE = function(value, tagDesc) {
  return value + tagDesc.value;
};

cwt._tagCodes.SET_VALUE = function(value, tagDesc) {
  return tagDesc.value;
};

cwt._tagCodes.VALUE = function( value, tagDesc ){
  return tagDesc.value;
}
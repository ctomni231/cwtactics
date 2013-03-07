controller.script.registerAttributeSolver( "valueResolver", 
function(tags, attr, rules) {
  var value = 0;
  for( var i=0,ie=rules.length; i<ie; i++ ){
  
    var rule = rules[i];
    if( rule.when ){
      
      var fails = false;
      for( var j=0,je=rule.when.length; j<je; j++ ){
        if( !tags[rule.when[j]] ){
          fails = true;
          break;
        }
      }
        
      if( fails ) continue;
      else value += rule[attr];
    }
    else value += rule[attr];
  }
    
  return value;
});
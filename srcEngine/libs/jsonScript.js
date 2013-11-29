// This file contains the _jsonScript_ interpreter. This file is needed to run
// pre-compiled _jsonScript_ rule lists.
//
(function(){

  // Parses a set of rules in a list `data` or a string that represents the same, into
  // a valid jsonScript rule list. A converter (`listener`) converts all strings in the
  // list to numeric representations. This numbers must map to correct positions in the
  // used memory array.
  //
  var mapStrings = function( data, listener ){

    // convert data into a js object
    if( typeof data === "string" ) data = JSON.parse(data);

    // parse every rule
    for( var ri=0,re=data.length; ri<re; ri++ ){
      var rule = data[ri];

      // check $when
      if( typeof rule.$when !== 'undefined'  ){
        var whenBlock = rule.$when;

        // slot -> values
        if( whenBlock.length%2 !== 0 ){
          throw Error("rule.$when lenght must be odd");
        }

        for( var wi=0,we=whenBlock.length; wi<we; wi+=2 ){


        }
      }
    }

    // return converted rule list
    return data;
  };

  // Solves an attribute (`attrName`) by iterating all rules from a `ruleList` in interconnection
  // to a given memory array (`memory`). A preset value (`value`) can be defined. If not then the
  // value `0` will be used as start value.
  //
  var solve = function( ruleList, memory, attrName, value ){

    // default start value is `0`
    if( typeof value !== 'number' ) value = 0;

    // evaluate all rules in the rule list
    for( var i=0,e=ruleList.length; i<e; i++ ){
      var rule    = ruleList[i];

      // ignore null
      if( rule === null ) continue;

      var attrVal = rule[attrName];

      // evaluate if the attribute is given in the rule
      if( typeof attrVal === "number" ){

        var ruleSolvesTrue = true;

        // check all conditions if given
        var list = rule.$when;
        if( list ){

          for( var li=0,le=list.length; li<le; li+=2 ){
            var slot  = memory[list[li]];
            var check = list[li+1];

            var attrSolvesTrue = false;

            // **CHECK:** between check
            if( check[0] === true ){
              if( slot >= check[1] && slot <= check[2] ){
                attrSolvesTrue = true;
              }
            }
            // **IS:** between check
            else{
              for( var ci=0,ce=check.length; ci<ce; ci++ ){
                if( slot === check[ci] ){
                  attrSolvesTrue = true;
                  break;
                }
              }
            }

            // when the condition fails then stop the process and ignore this rule
            if(!attrSolvesTrue){
              ruleSolvesTrue = false;
              break;
            }
          }
        }

        // change value when it`s condition matches
        if( ruleSolvesTrue ){

          // setter rule ?
          if( rule.$set ) value = 0;

          // modify value
          value += attrVal;
        }
      }
    }

    // return result
    return value;
  };

  // NodeJS/AMD export
  if( typeof exports !== 'undefined' ){
    exports.mapStrings 	= mapStrings;
    exports.solve 			= solve;
  }

  // Browser export
  if( typeof window !== 'undefined' ){
    if( !window.jsonScript ) window.jsonScript = {};
    window.jsonScript.mapStrings 	= mapStrings;
    window.jsonScript.solve 			= solve;
  }

})();
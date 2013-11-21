/*

 # Runtime Module

 This file contains the _jsonScript_ interpreter. This file is needed to run precompiled _jsonScript_ rule lists.

 */
(function(){

  /**
   Parses a set of rules into a rule list.

   @param {Array|json} data
   @param {Function} listener will be invoked when a non numeric value will be parsed in a condition
   @param {Array} targetList (default=[])
   */
  var mapStrings = function( data, listener ){

    // convert data into a js object
    if( typeof data === "string" ) data = JSON.parse(data);

    // parse every rule
    for( var ri=0,re=data.length; ri<re; ri++ ){
      var rule = data[ri];

      // check $set
      if( typeof rule.$set !== 'undefined' && typeof rule.$set !== 'boolean' ){
        throw Error("rule.$set value must be a boolean");
      }

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
  };

  /**
   Solves an attribute by iterating all rules from a list of rules
   in interconnection to a given memory set.

   @param {Array} ruleList
   @param {Array} memory
   @param {String} attrName
   @param {Number} value (default=0)
   */
  var solve = function( ruleList, memory, attrName, value ){
    if( typeof value !== 'number' ) value = 0;

    for( var i=0,e=ruleList.length; i<e; i++ ){
      var rule = ruleList[i];
      var attrVal = rule[attrName];
      if( typeof attrVal === "number" ){

        var ruleSolvesTrue = true;
        var list = rule.$when;
        if( list ){

          for( var li=0,le=list.length; li<le; li+=2 ){
            var slot = memory[list[li]];
            var check = list[li+1];

            var attrSolvesTrue = false;

            if( check[0] === true ){
              if( slot >= check[1] && slot <= check[2] ){
                attrSolvesTrue = true;
              }
            }
            else{
              for( var ci=0,ce=check.length; ci<ce; ci++ ){
                if( slot === check[ci] ){
                  attrSolvesTrue = true;
                  break;
                }
              }
            }

            if(!attrSolvesTrue){
              ruleSolvesTrue = false;
              break;
            }
          }
        }

        if( ruleSolvesTrue ){
          if( rule.$set ) value = 0;

          value += attrVal;
        }
      }
    }

    // RETURN RESULT
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

})();/*

 # Compiler Module

 This file contains the _jsonScript_ compiler. Normally the compiler is not needed when the target environment only wants to run precompiled _jsonScript_ rules. Include this file into your Mod SDK to allow simple string representations of your scripts.

 */
(function(){

  var SYNTAX = {
    "":["RULE"],
    "END":["RULE",null],
    "RULE":["WHEN","THEN"],
    "WHEN":["SLOT","THEN"],
    "SLOT":["IS","IN","BETWEEN"],
    "IS":["SLOT","THEN"],
    "IN":["SLOT","THEN"],
    "BETWEEN":["SLOT","THEN"],
    "THEN":["INCREASE","DECREASE","END"],
    "INCREASE":["INCREASE","DECREASE","END"],
    "DECREASE":["INCREASE","DECREASE","END"]
  };


  /**
   Compiles a given string to an _jsonScript_ compatible rule list. The generated rule is fully compatible to the JSON specification. This means you can serialize and deserialize it with the JSON object.

   @example

   Syntax:
   $RULE 					:= (RULE) $CONDITIONBLOCK (THEN) $ACTION{1,*} (END)
   $CONDITIONBLOCK := (WHEN) $CONDITION{1,*}
   $CONDITION 			:= (SLOT) $LITERAL ($IS|$IN|$BETWEEN)
   $IS							:= (IS) $LITERAL
   $IN							:= (IN) $LITERAL([,]$LITERAL){0,*}
   $BETWEEN				:= (BETWEEN) $NUMBER[,]$NUMBER
   $ACTION					:= (INCREASE|DECREASE) $LITERAL (BY) $NUMBER
   $NUMBER					:= [0-9]
   $LITERAL				:= [A-Za-z0-9]

   Example:
   RULE
   WHEN
   SLOT X IS Y
   SLOT Z IN A,B,C
   SLOT W BETWEEN 0,10
   THEN
   INCREASE attrA BY 10
   DECREASE attrB BY 1
   END
   */
  var compile = function( text ){
    var token, tokens, list, curRule, curWhen, next;

    next = SYNTAX[""];
    list = [];
    text = text.replace(/(\r\n|\n|\r|\n|\t)/gm," ");
    tokens = text.split(" ");

    for( var ti=0,te=tokens.length; ti<te; ti++ ){
      token = tokens[ti];

      // ignore this empty strings
      if( token.length === 0 ) continue;

      // check next
      if( next.indexOf( token ) === -1 ) throw Error(token+" token not allowed => expected "+JSON.stringify(next) );

      switch( token ){

        case "RULE":
          curRule = {};
          list.push(curRule);
          break;

        case "WHEN":
          curWhen = [];
          break;

        case "THEN":
          if( curWhen !== null ){
            curRule.$when = curWhen;
            curWhen = null;
          }
          break;

        case "SLOT":
          curWhen.push(tokens[ti+1]);
          ti += 1;
          break;

        case "IS":
          curWhen.push([true,tokens[ti+1],tokens[ti+1]]);
          ti += 1;
          break;

        case "BETWEEN":
          curWhen.push( tokens[ti+1].split(",") );
          if( curWhen[curWhen.length-1].length !== 2 ) throw Error("BETWEEN expects list with two values (lower,upper)");
          ti += 1;
          break;

        case "IN":
          curWhen.push( tokens[ti+1].split(",") );
          ti += 1;
          break;

        case "INCREASE":
          if( tokens[ti+2] !== "BY" ) throw Error("by expected after attribute but found "+tokens[ti+2]);
          var value = parseInt( tokens[ti+3], 10 );
          if( typeof value !== 'number' ) throw Error("number expected by increase");
          curRule[tokens[ti+1]] = value;
          ti += 3;
          break;

        case "DECREASE":
          if( tokens[ti+2] !== "BY" ) throw Error("by expected after attribute but found "+tokens[ti+2]);
          var value = -parseInt( tokens[ti+3], 10 );
          if( typeof value !== 'number' ) throw Error("number expected by decrease");
          curRule[tokens[ti+1]] = value;
          ti += 3;
          break;

        case "END":
          curRule = null;
          break;

        default: throw Error("unknown token => "+token);
      }

      next = SYNTAX[token];
    }

    if( next.indexOf(null) === -1 ) throw Error("end of rule defintion is not allowed");

    return list;
  };

  /**
   Decompiles a given _jsonScript_ compatible rule list back to a string.

   @example

   [{ $when:["A",["C"]], attrA:+1 }] -> RULE WHEN A IS C THEN INCREASE attrA BY 1 END
   */
  var decompile = function( ruleList ){
    var rule,keys;
    var tokens = [];

    for( var ri=0,re=ruleList.length; ri<re; ri++ ){
      rule = ruleList[ri];
      keys = Object.keys( rule );

      tokens.push("RULE");
      tokens.push("\n");

      if( rule.$when ){
        var when = rule.$when;
        for( var ki=0,ke=when.length; ki<ke; ki+=2 ){
          tokens.push(" SLOT");
          tokens.push(when[ki]);

          if( when[ki+1][0] === true ){
            if( when[ki+1][1] === when[ki+1][2] ){
              tokens.push("IS");
              tokens.push( when[ki+1][1] );
            }
            else{
              tokens.push("BETWEEN");
              tokens.push( when[ki+1][1]+","+when[ki+1][2] );
            }
          }
          else{
            tokens.push("IN");
            tokens.push( when[ki+1].join(",") );
          }
          tokens.push("\n");
        }
      }

      tokens.push("THEN");
      tokens.push("\n");

      for( var ki=0,ke=keys.length; ki<ke; ki++ ){
        if( keys[ki] === "$when" ) continue;
        else{
          if( rule[keys[ki]] < 0 ) tokens.push(" DECREASE");
          else tokens.push(" INCREASE");
          tokens.push( keys[ki] );
          tokens.push("BY");
          tokens.push( (rule[keys[ki]]<0)? -rule[keys[ki]] : rule[keys[ki]] );
          tokens.push("\n");
        }
      }

      tokens.push("END");
      tokens.push("\n");
    }

    return tokens.join(" ");
  }

  // NodeJS/AMD export
  if( typeof exports !== 'undefined' ){
    exports.compile 	= compile;
    exports.decompile = decompile;
  }

  // Browser export
  if( typeof window !== 'undefined' ){
    if( !window.jsonScript ) window.jsonScript = {};
    window.jsonScript.compile 	= compile;
    window.jsonScript.decompile = decompile;
  }

})();
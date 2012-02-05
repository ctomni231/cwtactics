/**
 * @author BlackCat
 * @version 2.99 Beta1
 * @forks https://github.com/Floby/node-tokenizer at data 03.02.2012 
 *        uses the noke-tokenizer as parser
 *
 * NekoScript library for custom JSON based scripting. Neko itself uses a tree
 * based system to optimize database queries. The queries will be splittet 
 * into its sub conditions and will be sorted into the tree. Same conditions 
 * will be sorted into the same branch. 
 * 
 * E.g. two conditions
 * WHEN x > 10 THEN ... and WHEN x > 20 THEN ...
 * x > 20 will be a sub node in the branch of x > 10. If x > 10 fails, x > 20
 * will never checked, because it never can be true.
 * 
 * ##Changelog##
 * - Version 2.99B1
 *     - Basic parser
 *     - Initial Version
 *
 *
 * ##History of NekoScript##
 * This chapter wants to describe the history of nekoScript. This history is 
 * very long and very funny. Neko was born as MeowShell with the MiniWars 
 * project.
 * 
 * ####MiniWars####
 * MiniWars itself was a advance wars copy by BlackCat. It was very 
 * successfull until a first playable beta with multiplayer tests. The project
 * was founded by BlackCat to learn Java for the university. Later on, 
 * BlackCat joined the Custom Wars team to combine know how and increasing 
 * development speed by increasing the number of developers.
 * 
 * ####Custom Wars Tactics####
 * Because the differences between MiniWars and Custom Wars was so high, 
 * BlackCat, Stef and JSR founded Custom Wars Tactics.
 * 
 * ####MeowShell 1####
 * ...
 * 
 * ####MeowShell 2####
 * ...
 * 
 * ####NekoJS####
 * 
 * ####NekoScript 3.0####
 * NekoScript was created with the dependencies of CWT on a runtime changeable 
 * scripting engine. Furthermore BlackCat was heavily stressed by finding the 
 * reason of Neko. Finally Neko could go back to its initial founding reason, 
 * Scripting. Neko no longer doing things, that other libraries doing a lot 
 * better. NekoScript will provide a high configurable, runtime changeable
 * (extendable) scripting environment for Javascript. Another, very important, 
 * reason of NekoScript is the wish to allow loading map files over network on
 * all CWT platforms (as well mobile devices). Because JSON is the data 
 * exchanging format, NekoScript is a fully JSON compatible engine. Neko will 
 * allow reading scripts from JSON objects and parsing it into the knowlegde 
 * base and as well, removing them later. This feature is very important for 
 * maps with scripts.
 * 
 * 
 * ##Pattern matching##
 * This part of NekoScript is heavily inspired by JBOSS drools. The idea is to
 * increase the speed and intelligence of the runtime rule checking by 
 * sorting the conditions into relationships. Like shown in the first chapter,
 * x > 20 must not be checked, if x > 10 fails.
 * 
 * 
 * ##FAQ##
 * **Q: Is NekoScript a sub language of JavaScript?**  
 * A: NekoScript should not be understood as programming language. NekoScript
 *    itself has only a very small set of instructions and interaction with 
 *    the user context. It should be understood more as a small DSL to 
 *    interact with objects of a data pool.
 *    
 * **Q: Why don't you use plain Javascript as strings in JSON and parse them 
 *      via eval(str)?**  
 * A: This has mainly two reasons. First, the user can access the whole system 
 *    and data models with pure JavaScript. We know it exists several technics
 *    to hide our stuff in private scopes, but this breaks a lot of our 
 *    accepted coding style. Futhermore we can limit the access to functions 
 *    easy with an own language. We can decide what is access able and what 
 *    not. ;) 
 *    The second reason is security. Because we try to implement an online map
 *    loading as well, the chance of Cross Site Scripting (CSS) is very high.
 *    If we eval code directly, the map scripts could contain code that could
 *    tries to steal your user agent information, cookie data or similar. 
 *    A pre checking JavaScript code would be a very high overhead in our 
 *    opinion.
 *    
 * **Q: Will NekoScript get feature X/Y/Z?**  
 * A: We are always happy about advises and ideas. Please feel free to use the
 *    issue page of the CWT project to provide your ideas for NekoScript. But
 *    please remember, NekoScript wont be a Javascript replacement! So dont 
 *    expect features like classes, JSON parsing, HTML submits or similar in 
 *    NekoScript.
 * 
 * 
 * ##Syntax##
 *     Rule:  
 *       WHEN Condition [(AND|OR) Condition]... 
 *       THEN Action [; Action]
 * 
 *     Condition:
 *       object CONDITION_OPERATOR value
 * 
 *     CONDITION_OPERATOR:
 *       IS|NOT|GE|GT|LE|LT
 * 
 *     Action: 
 *       object ACTION_OPERATOR value [,value]...
 * 
 *     ACTION_OPERATOR:
 *       +=|-=|/=|*=|%=
 * 
 * How the engine gets the atrribute:
 * a.x -> datapool["a"]["x"] 
 *        resolves really into a.x if datapool["a"] = a
 *        
 * a.x.y -> not yet
 */
 (function(exports){  
  
    /**
     * NekoScript syntax nodes.
     */
    var SYNTAX_NODES = {
      
        WHEN:{
            after: [],
            expr:/WHEN/ 
        },
        
        THEN:{
            after: [],
            expr:/THEN/ 
        },

        ON:{
            after: [],
            expr:/ON/ 
        },

        NUMBER:{
            expr:/\d+(\.\d+)?/
        },
        
        OBJECT_PARAMETER:{
            after: [ ],
            expr:/\w+(\.\w+)+/ 
        },


        /* Conditional operator */
        /* ==================== */

        WHITESPACE:{
          expr:/ /
        },
        
        WORD:{
          expr:/\w+[.]{0}/
        },

        GREATER:{
            after: [ ],
            expr:/>/ 
        },

        GREATEREQ:{
            after: [ ],
            expr:/>=/ 
        },

        LOWER:{
            after: [ ],
            expr:/</ 
        },

        LOWEREQ:{
            after: [ ],
            expr:/<=/ 
        },

        NOT_EQUALS:{
            after: [ ],
            expr:/!=/ 
        },

        EQUALS:{
            after: [ ],
            expr:/\=\=/ 
        },
        
        
        /* Connectors */
        /* ========== */

        AND:{
            after: [ ],
            expr:/AND/ 
        },

        OR:{
            after: [ ],
            expr:/OR/ 
        },


        /* Operations */
        /* ========== */

        ADD:{
            expr:/\+=/
        },

        SUB:{
            expr:/\-=/
        },

        DIV:{
            expr:/\/=/
        },

        MUL:{
            expr:/\*=/
        },

        MOD:{
            expr:/\%=/
        }
    }
    var SYNTAX_VALUES = [];
    for( var el in SYNTAX_NODES ){
      if( SYNTAX_NODES.hasOwnProperty(el) ) SYNTAX_VALUES.push( el );
    }
    

    // class Session
    var Session = function( knowlegdeBase ){
      this._kb = knowlegdeBase;
      this._memory = {};
    }
    
    // class Session API
    Session.prototype = {

        insert: function( name, object ){
          if( this._memory.hasOwnProperty(name) ) 
            throw Error("property "+name+" already exists in memory");
          
          this._memory[name] = object;
        },

        clear: function(){
          // remove data ojects from memory
          for( var el in this._memory ){
            if( this._memory.hasOwnProperty(el) ) delete this._memory[el];
          }
        },
        
        remove: function( name ){
          if( this._memory.hasOwnProperty(name) ) delete this._memory[name];
        },

        run: function(){
          // run rule engine with the memory of the session
        }
    }

    // class KnowlegdeBase
    var KnowlegdeBase = function(){
      this._ignored = {};
      this._ruleTree = []; // tree
      this._rules = {};  // object<ruleID,ruleNodes>
    }

    // class KnowlegdeBase API
    KnowlegdeBase.prototype = {
        
        // PARSES A RULE AND PUTS THE NODES INTO THE DATA TREE
        parseRule: function( rule ){
            
            // holds all parsed nodes, beginning with root (empty array)
            var _nodeStack = [];
            
            var cIndex = 0;
            var matching = []; // array of matching rules of the previous iteration
            var sel;
            while( cIndex < rule.length) {
                
                sel = rule.substring(cIndex,rule.length);
                var found = false;
                for( var i in SYNTAX_VALUES ){
                  console.log("search "+SYNTAX_VALUES[i]+" reg "+SYNTAX_NODES[SYNTAX_VALUES[i]].expr+" on "+sel);
                  var reg = SYNTAX_NODES[SYNTAX_VALUES[i]].expr;
                  var index = sel.search(reg);
                  if( index == 0 ){
                    // found 
                    found = true;
                    console.log("found... i was "+cIndex);
                    cIndex+= ((sel.match(reg))[0]).toString().length;
                    if( SYNTAX_VALUES[i] !== "WHITESPACE") 
                      matching.push( SYNTAX_VALUES[i]+" ("+((sel.match(reg))[0]).toString()+")" );
                    console.log("... i is now "+cIndex+" --> "+((sel.match(reg))[0]).toString()  );
                    break;
                  }
                  console.log("index is "+index);
                }
                
                if( found ) continue;
                break;
            }
            
            console.log("FOUND:")
            for( var i in matching ) console.log( matching[i] );
        }
    }

    // export public objects
    exports.KnowlegdeBase = KnowlegdeBase;
    exports.Session = Session;

})( ( typeof exports !== 'undefined' )? exports:(window.NekoScript = {}) );
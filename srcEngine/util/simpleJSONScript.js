/**

  This is a small but very serialization friendly rule engine for JavaScript. It's originally designed
  for Custom Wars Tactics (Link:) but can be used in other turn based games as well. 
  
  The main approach of the jsonRuleEngine is to provide a simple base with a solid API. Your program is 
  able to control the rule flow and interpreting on top of this platform. The engine itself won't do 
  complex things like interpreting! In our opinion this must be done by the program itself which is using
  it. This is because only the highest level (the game itself) knows internal things about it's structure
  and it's flow.
  
  Organization stuff will be done by the jsonRuleEngine. This combines several things like contexts, owners,
  (de)serialization of rules and event management. 
  
  License (MIT):
    
    Copyright (c) 2013 BlackCat [blackcat.myako@googlemail.com] and JSR [ctomni231@googlemail.com]

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
    copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
    following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  */

if( jsonRuleEngine !== undefined ) throw Error("jsonRuleEngine is already defined in the global scope");

/**
 *
 */
var jsonRuleEngine = function(){
  var engine = {};
  
  /**
   * @private
   */
  engine.ruleContexts_ = {};
  
  /**
   * @private
   */
  engine.attributeSolver_ = {};
  
  /**
   * @private
   */
  engine.tagsSolver_ = {};
  
  /**
   *
   * @param {String} ctxKey context name
   * @param {Object} rule rule object
   */
  engine.pushRuleToCtx = function( ctxKey, rule ){
    if( !engine.ruleContexts_.hasOwnProperty(ctxKey) ){
      engine.ruleContexts_[ctxKey] = {};
    } 
    
    // MAP EVERY ATTRIBUTE TO CONTEXT
    var attributes = Object.keys( rule );
    for( var i=0,e=attributes.length; i<e; i++ ){
      var attr = attributes[i];
      
      // WHEN IS A ENGINE KEYWORD
      if( attr === "when" ) continue;
      
      if( !engine.ruleContexts_[ctxKey].hasOwnProperty(attr) ){
        engine.ruleContexts_[ctxKey][attr] = [];
      } 
      
      // PUSH RULE TO CONTEXT
      engine.ruleContexts_[ctxKey][attr].push(rule);
    }
  };
  
  /**
   *
   * @param {String} ctxKey context name
   * @param {Object} rule rule object
   */
  engine.removeRuleFromCtx = function( ctxKey, rule ){
    if( !engine.ruleContexts_.hasOwnProperty(ctxKey) ){
      throw Error("given context is not created"); 
    }
    
    // MAP EVERY ATTRIBUTE TO CONTEXT
    var attributes = Object.keys( rule );
    for( var i=0,e=attributes.length; i<e; i++ ){
      var attr = attributes[i];
      
      // WHEN IS A ENGINE KEYWORD
      if( attr === "when" ) continue;
      if( engine.ruleContexts_[ctxKey].hasOwnProperty(attr) ) continue;
      
      // REMOVE RULE TO CONTEXT
      var attrList = engine.ruleContexts_[ctxKey][attr];
      var index = attrList.indexOf( rule );
      if( index !== -1 ){
        attrList.splice( index, 1 );
      }
    }
  };
  
  /**
   *
   * @param {Object} impl solver implementation
   */
  engine.registerResolver = function( impl ){
    if( !impl.hasOwnProperty("key") ) throw Error("solver implementation needs a valid key");
    
    engine.eventSolver_[impl.key] = impl;
  };
  
  /**
   *
   * @param {String} key solver key
   * @param {Function} fn solver function
   */
  engine.registerAttributeSolver = function( key, fn ){    
    engine.attributeSolver_[key] = fn;
  };
  
  /**
   *
   * @param {String} key solver key
   * @param {Function} fn solver function
   */
  engine.registerTagsSolver = function( key, fn ){    
    engine.tagsSolver_[key] = fn;
  };
  
  /**
   *
   * @param {Object...} solver arguments
   * @param {String} tagsSolver identifier name of the solver
   * @param {String} attributeSolver identifier name of the solver
   * @param {String} attributeName attribute name
   * @param {String} ctx name of the context
   */
  engine.solveAttribute = function(){
    var tagsSolver      = arguments[ arguments.length-4 ];
    var attributeSolver = arguments[ arguments.length-3 ];
    var attribute       = arguments[ arguments.length-2 ];
    var ctx             = arguments[ arguments.length-1 ];
    
    tagsSolver      = engine.tagsSolver_[tagsSolver];
    attributeSolver = engine.attributeSolver_[attributeSolver];
    
    var tags = tagsSolver.apply(null, arguments);
    
    return attributeSolver.call( 
      this, 
      tags, 
      attribute, 
      engine.ruleContexts_[ctx][attribute]
    );
  };
  
  return engine;
};
/**
 MIT License

 Copyright (c) 2012, Radom Alexander [alias BlackCat]

 Contributors:
   Carr Crecen [alias JSRulz]

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial
   portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @namespace
 */
var nekoScript = {};

/**
 * Returns the version of nekoScript as string. The format of the version string is:
 * @example
 * major.minor.build
 *
 * @return {string}
 */
nekoScript.version = function(){
  // TARGET: return "3.0.0"
  return "2.9.95 Beta";
};

var DEBUG = true;

/**
 * Tag stack holds an amount of tags and symbolizes a thematical group. Furthermore the TagStack allows to interact
 * with the added tags.
 *
 * @example
 * var stack;
 * stack = new nekoScript.TagStack();
 * stack = nekoScript.Factory.TagStack();
 *
 * @constructor
 */
nekoScript.TagStack = function(){
  /** @type {Array<{ t: function, a: boolean }>} */
  this._tags = [];
};

// TagStack prototype
nekoScript.TagStack.prototype = {

  /**
   * Registers a tag object in the tag stack.
   *
   * @param { { t: function, a: boolean } } tagObj
   */
  addTag: function( tagObj ){
    if( DEBUG ) nekoLog.info('adding {0} to tag stack',JSON.stringify(tagObj));

    if( typeof tagObj.fn !== 'function' || typeof tagObj.a !== 'boolean' )
      throw Error('a tag object needs a function object as attribute fn and a boolean attribute a');

    this._tags[ this._tags.length ] = tagObj;
  },

  /**
   * Removes a tag object from the stack.
   *
   * @param tagObj
   */
  removeTag: function( tagObj ){
    if( DEBUG ) nekoLog.info('removing {0} from tag stack',JSON.stringify(tagObj));

    var index = this._tags.indexOf(tagObj);
    if( index === -1 ) throw Error(nekoLog.format('tag object {0} is not registered',tagObj));
    this._tags.splice(index,1);
  },

  /**
   * Clears all tags from the tag stack.
   */
  removeTags: function( ){
    if( DEBUG ) nekoLog.info('removing all tags from stack');

    this._tags.clear();
  },

  /**
   * Activates all tags of the group
   */
  activateTags: function(){
    if( DEBUG ) nekoLog.info('activating all tags');

    for( var i=0,e=this._tags.length; i<e; i++ ) this._tags[i].a = true;
  },

  /**
   * Deactivates all tags of the group
   */
  deactivateTags: function(){
    if( DEBUG ) nekoLog.info('deactivating all tags');

    for( var i=0,e=this._tags.length; i<e; i++ ) this._tags[i].a = false;
  },

  /**
   * Invokes the all tags of a given context.
   *
   * @param {string} context
   * @param {object} wm
   */
  invoke: function( wm ){
    if( DEBUG ) nekoLog.info('invoking all tags with working memory');

    // iterate through all script tags and call the function of every tag
    for( var i = 0, e=this._tags.length; i<e; i++ ) this._tags[i].a && this._tags[i].fn(wm);
  }
};
/**
 * A tag service is the union of tag stacks and tag tickers. This class is a service to provide a clean API to
 * control the internal tags.
 */
nekoScript.TagContainer = function(){
  this._stacks = {};
};

// tag service prototype
nekoScript.TagContainer.prototype = {

  /**
   * Returns a tag stack for a given context name. If the tag stack does not exists then a new one will be created.
   *
   * @param {string} tName
   */
  tagStack: function( tName ){
    if( !this._stacks.hasOwnProperty(tName) ){
      if( DEBUG ) nekoLog.info('creating tag stack for context {0}',tName);

      this._stacks[tName] = new nekoScript.TagStack();
    }
    return this._stacks[tName];
  },

  /**
   * Does a tagStack(name).invoke(wm). But if the tagStack does not exists then no new one will be created.
   *
   * @param {string} tName
   * @param {object} wm
   */
  invoke: function( tName, wm  ){
    if( DEBUG ) nekoLog.info('invoking tag stack for {0}',tName);

    if( this._stacks.hasOwnProperty(tName) ) this._stacks[tName].invoke(wm);
  },

  /**
   * Clears all registered stacks in the tag service.
   */
  clear: function(){
    if( DEBUG ) nekoLog.info('clearing all tag stacks');

    var keys,key;

    // tag stacks
    keys = Object.keys(this._stacks);
    for( var i=0,e=keys.length; i<e; i++ ){
      key = keys[i];
      this._stacks[key].clear();
    }
  }
};
/**
 * A nekoScript parser instance compiles tag objects into usable nekoScript tag objects.
 *
 * @constructor
 * @param {Array<{ name:string, schema:object, compiler: function }>} compilerNodes
 */
nekoScript.Compiler = function( compilerNodes, flags ){

  if( compilerNodes === undefined ) compilerNodes = [];
  if( typeof flags === 'undefined' || flags.noBuiltinNodes !== true ){
    if( DEBUG ) nekoLog.info('add default nekoScript compiler nodes');

    // add built in compiler nodes
    for( var i=0,e=nekoScript.Compiler.inbuildNodes.length; i<e; i++ ){
      compilerNodes[compilerNodes.length] = nekoScript.Compiler.inbuildNodes[i];
    }
  }

  // instance variables
  this._schema = null;
  this._nodeComp = [];

  // create node properties
  for( var i=0,e=Object.keys(nekoScript.Compiler.times).length; i<e; i++ ) this._nodeComp[i] = {};

  // build compiler nodes
  var node;
  var cmpNode;
  for( var i=0,e=compilerNodes.length; i<e; i++ ){
    node = compilerNodes[i];
    if( DEBUG ) nekoLog.info('register compiler node {0}',node.name);

    if( typeof this._nodeComp[ node.when ] === undefined ) this._nodeComp[ node.when ] = {}

    cmpNode = this._nodeComp[ node.when ];
    cmpNode[ node.name ] = {
      s: node.schema,
      c: node.compiler
    };
  }
};

/**
 * Compiler of nekoScript to parse tag objects into script tags.
 *
 * @namespace
 */
nekoScript.Compiler.prototype = {

  _compileTime: function( fnT, tIndex, tagT, data ){
    if( DEBUG ) nekoLog.info('compiling time {0}',tIndex);

    var nodes = Object.keys(this._nodeComp[tIndex]);
    var key,node;
    for( var i=0,e=nodes.length; i<e; i++ ){
      key = nodes[i];
      if( DEBUG ) nekoLog.info('checking key {0}',key);

      node = this._nodeComp[tIndex][key];

      // data has key
      if( data[key] ){
        if( DEBUG ) nekoLog.info('node has key {0}, validating and inserting it',key);

        amanda.validate( data[key], node.s, function(e){
          if(e) throw Error(nekoLog.format('cannot use node {0} on {1} because of validation error {2}',
                            key,JSON.stringify(data),JSON.stringify(e.getMessages())));
        });

        fnT[fnT.length] = node.c( data[key] , tagT );

        if( fnT[fnT.length-1] !== undefined ){
          if( DEBUG ) nekoLog.info('setting working memory adapters');
          fnT[fnT.length-1] = nekoScript.Compiler.setWorkingMem( fnT[fnT.length-1] );

          if( DEBUG ) nekoLog.info('looking for illegal content on {0}', fnT[fnT.length-1]);
          nekoScript.Compiler.checkIllegalContent( fnT[fnT.length-1] );
        }
      }
    }
  },

  compile: function( data, flags ){
    if( DEBUG ) nekoLog.info('compiling object {0}',JSON.stringify(data));

    var tagTemplate = {};

    // some useful functions
    var adaptWM = nekoScript.Compiler.setWorkingMem;
    var illegalCheck = nekoScript.Compiler.checkIllegalContent;

    var fnT = [];
    var tmp;
    fnT[fnT.length] = 'fn = function( wm ){';
    this._compileTime( fnT, nekoScript.Compiler.times.BEFORE, tagTemplate, data );
    fnT[fnT.length] = 'if(';
    tmp = fnT.length;
    this._compileTime( fnT, nekoScript.Compiler.times.CONDITION, tagTemplate, data );
    if( tmp === fnT.length ) fnT[fnT.length] = 'true'; // add true condition if nothing was added
    fnT[fnT.length] = '){';
    this._compileTime( fnT, nekoScript.Compiler.times.THEN_BLOCK, tagTemplate, data );
    fnT[fnT.length] = '}else{';
    this._compileTime( fnT, nekoScript.Compiler.times.ELSE_BLOCK, tagTemplate, data );
    fnT[fnT.length] = '}';
    this._compileTime( fnT, nekoScript.Compiler.times.AFTER, tagTemplate, data );
    fnT[fnT.length] = '}';

    fnT = fnT.join('');

    if( DEBUG ) nekoLog.info('compiling {0}',fnT);
    var fn;
    eval(fnT); // evaluate

    // setup template
    tagTemplate.fn = fn;
    tagTemplate.a = true;

    return tagTemplate;
  }
};


nekoScript.Compiler._replWM = function( content ){
  return 'wm.'+content;
}

/**
 * Adppends all variable accessing code in the element string with a wm. to make an adapter for
 *
 * @param {string} content
 */
nekoScript.Compiler.setWorkingMem = function( content ){
  return content.replace(/[A-Za-z](\w)*([.][A-Za-z](\w)*)*/g,nekoScript.Compiler._replWM);
};

/**
 * Searches illegal content ( define functions, variables and so on ) in a string and throwing an error on
 * matching content.
 *
 * @param {string} content
 */
nekoScript.Compiler.checkIllegalContent = function( content ){
  if( content.match(/(function)(\s)*(\()/g) ||
    content.match(/(var)(\s)*(=)/g)           ){
    throw Error('content has illegal content');
  }
};

/**
 * Different compiler times for compiler nodes.
 *
 * @namespace
 */
nekoScript.Compiler.times = {

  /**
   * Will be checked first.
   *
   * @constant
   */
  BEFORE:0,

  /**
   * It's content will be placed into the condition body of a tag.
   *
   * @constant
   */
  CONDITION:1,

  /**
   * It's content will be placed into the then body of a tag.
   *
   * @constant
   */
  THEN_BLOCK:2,

  /**
   * It's content will be placed into the else body of a tag.
   *
   * @constant
   */
  ELSE_BLOCK:3,

  /**
   * Will be checked at least.
   *
   * @constant
   */
  AFTER:4
};

nekoScript.Compiler.inbuildNodes = [

  {
    name:'on',
    schema:{
      type:'string',
      pattern:/^[A-Za-z](\w)*([.][A-Za-z](\w)*)*$/g // on descriptor starts with a non alphanumeric character
    },
    when: nekoScript.Compiler.times.BEFORE,
    compiler: function( content, tag ){ tag.on = content; }
  },

  // conditions
  {
    name:'where',
    schema:{
      type:'string',
      required:false
    },
    when: nekoScript.Compiler.times.CONDITION,
    compiler:function( content, tag ){ return content; }
  },

  // actions connector
  {
    name:'do',
    schema:{
      type:'string',
      required:true
    },
    when: nekoScript.Compiler.times.THEN_BLOCK,
    compiler:function( content, tag ){ return content; }
  }
];
/**
 * Some useful factory functions, to create nekoScript objects.
 *
 * @namespace
 */
nekoScript.Factory = {

  /**
   * Returns a new nekoScript.TagStack instance.
   *
   * @return {nekoScript.TagStack}
   */
  TagStack: function(){
    return new nekoScript.TagStack();
  },

  /**
   * Returns a new nekoScript.Compiler instance.
   *
   * @param {Array<{ name:string, schema:object, compiler: function }>} nodes
   * @return {nekoScript.Compiler} nekoScript compiler instance
   */
  Compiler: function( nodes, flags ){
    return new nekoScript.Compiler( nodes, flags );
  },

  /**
   * @return {nekoScript.TagContainer}
   */
  TagContainer: function(){
    return new nekoScript.TagContainer();
  }
};
module.exports = nekoScript;
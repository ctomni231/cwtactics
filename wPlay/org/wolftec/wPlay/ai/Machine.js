var Base=function(){if(arguments.length)this==window?Base.prototype.extend.call(arguments[0],arguments.callee.prototype):this.extend(arguments[0])};Base.version="1.0.2"; Base.prototype={extend:function(b,d){var g=Base.prototype.extend;if(arguments.length==2){var e=this[b],h=this.constructor?this.constructor.prototype:null;if(e instanceof Function&&d instanceof Function&&e.valueOf()!=d.valueOf()&&/\bbase\b/.test(d)){var a=d;d=function(){var k=this.base,l=this;this.base=e;this.baseClass=h;var m=a.apply(this,arguments);this.base=k;this.baseClass=l;return m};d.valueOf=function(){return a};d.toString=function(){return String(a)}}return this[b]=d}else if(b){var i={toSource:null}, c=["toString","valueOf"];if(Base._prototyping)c[2]="constructor";for(var j=0;f=c[j];j++)b[f]!=i[f]&&g.call(this,f,b[f]);for(var f in b)i[f]||g.call(this,f,b[f])}return this},base:function(){}}; Base.extend=function(b,d){var g=Base.prototype.extend;b||(b={});Base._prototyping=true;var e=new this;g.call(e,b);var h=e.constructor;e.constructor=this;delete Base._prototyping;var a=function(){Base._prototyping||h.apply(this,arguments);this.constructor=a};a.prototype=e;a.extend=this.extend;a.implement=this.implement;a.create=this.create;a.getClassName=this.getClassName;a.toString=function(){return String(h)};a.isInstance=function(c){return typeof c!="undefined"&&c!==null&&c.constructor&&c.constructor.__ancestors&& c.constructor.__ancestors[a.getClassName()]};g.call(a,d);b=h?a:e;b.init instanceof Function&&b.init();if(!a.__ancestors){a.__ancestors={};a.__ancestors[a.getClassName()]=true;var i=function(c){if(c.prototype&&c.prototype.constructor&&c.prototype.constructor.getClassName){a.__ancestors[c.prototype.constructor.getClassName()]=true;i(c.prototype.constructor)}};i(a)}if(a.getClassName)b.className=a.getClassName();return b};Base.implement=function(b){if(b instanceof Function)b=b.prototype;this.prototype.extend(b)}; Base.create=function(){};Base.getClassName=function(){return"Base"};Base.isInstance=function(){};

/*
  Machine.js
  by mary rose cook
  http://github.com/maryrosecook/machinejs

  Make behaviour trees in JavaScript.
  See index.html for an example.

  Uses Base.js by Dean Edwards.  Thanks, Dean.
*/

(function() {
  /*
    The tree generator.  Instantiate and then call generateTree(),
    passing the JSON definition of the tree and the object the tree controls.
  */
  var Machine = Base.extend({
    constructor: function() { },

    // makes behaviour tree from passed json and returns the root node
    generateTree: function(treeJson, actor, states) {
      states = states || actor;
      return this.read(treeJson, null, actor, states);
    },

    // reads in all nodes in passed json, constructing a tree of nodes as it goes
    read: function(subTreeJson, parent, actor, states) {
      var node = null;
      if (subTreeJson.pointer == true)
        node = new Pointer(subTreeJson.identifier,
                           subTreeJson.test,
                           subTreeJson.strategy,
                           parent,
                           actor,
                           states);
      else
        node = new State(subTreeJson.identifier,
                         subTreeJson.test,
                         subTreeJson.strategy,
                         parent,
                         actor,
                         states);

      node.report = subTreeJson.report;

      if(subTreeJson.children !== undefined)
        for (var i = 0; i < subTreeJson.children.length; i++)
          node.children[node.children.length] = this.read(subTreeJson.children[i],
                                                          node, actor, states);

      return node;
    }
  }, {
    getClassName: function() {
      return "Machine";
    }
  });

  // EXPORT
  window['Machine'] = Machine;

  /*
    The object for nodes in the tree.
  */
  var Node = Base.extend({
    identifier: null,
    test: null,
    strategy: null,
    parent: null,
    children: null,
    actor: null,
    states: null,
    report: null,

    constructor: function(identifier, test, strategy, parent, actor, states) {
      this.identifier = identifier;
      this.test = test;
      this.strategy = strategy;
      this.parent = parent;
      this.actor = actor;
      this.states = states;
      this.children = [];
    },

    // A tick of the clock.  Returns the next state.
    tick: function() {
      if (this.isAction()) // run an actual action
        this.run();

      var potentialNextState = this.nextState();
      var actualNextState = null;
      if (potentialNextState !== null)
        actualNextState = potentialNextState.transition();
      else if (this.can()) // no child state, try and stay in this one
        actualNextState = this;
      else // can't stay in this one, so back up the tree
        actualNextState = this.nearestRunnableAncestor().transition();

      return actualNextState;
    },

    // gets next state that would be moved to from current state
    nextState: function() {
      var strategy = this.strategy;
      if (strategy === undefined) {
        var ancestor = this.nearestAncestorWithStrategy();
        if (ancestor !== null)
          strategy = ancestor.strategy;
      }

      if (strategy !== null)
        return this[strategy].call(this);
      else
        return null;
    },

    isTransition: function() {
      return this.children.length > 0 || this instanceof Pointer;
    },

    isAction: function() {
      return !this.isTransition();
    },

    // returns true if actor allowed to enter this state
    can: function() {
      var functionName = this.test; // can specify custom test function name
      if (functionName === undefined) // no override so go with default function name
        functionName = "can" + this.identifier[0].toUpperCase() + this.identifier.substring(1, this.identifier.length);

      if (this.states[functionName] !== undefined)
        return this.states[functionName].call(this.actor);
      else // no canX() function defined - assume can
        return true;
    },

    // switches state to direct child of root state with passed identifier
    // use very sparingly - really only for important events that
    // require machine to temporarily relinquish control over actor
    // e.g. a soldier who is mostly autonomous, but occasionally receives orders
    warp: function(identifier) {
      var rootNodeChildren = this.getRootNode().children;
      for(var i = 0; i < rootNodeChildren.length; i++)
        if(rootNodeChildren[i].identifier == identifier)
          return rootNodeChildren[i];

      return this; // couldn't find node - stay in current state
    },

    // returns first child that can run
    prioritised: function() {
      return this.nextRunnable(this.children);
    },

    // gets next runnable node in passed list
    nextRunnable: function(nodes) {
      for (var i = 0; i < nodes.length; i++)
        if (nodes[i].can())
          return nodes[i];

      return null;
    },

    // runs all runnable children in order, then kicks up to children's closest runnable ancestor
    sequential: function() {
      var nextState = null;
      if (this.isAction()) // want to get next runnable child or go back up to grandparent
      {
        var foundThis = false;
        for (var i = 0; i < this.parent.children.length; i++) {
          var sibling = this.parent.children[i];
          if (this.identifier == sibling.identifier)
            foundThis = true;
          else if (foundThis && sibling.can())
            return sibling;
        }
      }
      else // at a sequential parent so try to run first runnable child
      {
        var firstRunnableChild = this.nextRunnable(this.children);
        if (firstRunnableChild !== null)
          return firstRunnableChild;
      }

      return this.nearestRunnableAncestor(); // no more runnable children in the sequence so return first runnable ancestor
    },

    // returns first namesake forebear encountered when going directly up tree
    nearestAncestor: function(test) {
      if (this.parent === null)
        return null;
      else if (test.call(this.parent) === true)
        return this.parent;
      else
        return this.parent.nearestAncestor(test);
    },

    // returns root node of whole tree
    getRootNode: function() {
      if(this.parent === null)
        return this;
      else
        return this.parent.getRootNode();
    },

    nearestAncestorWithStrategy: function() {
      return this.nearestAncestor(function() {
        return this.strategy !== undefined && this.strategy !== null;
      });
    },

    // returns nearest ancestor that can run
    nearestRunnableAncestor: function() {
      return this.nearestAncestor(function() {
        return this.can();
      });
    },

    nearestNamesakeAncestor: function(identifier) {
      return this.nearestAncestor(function() {
        return this.identifier == identifier;
      });
    }
  }, {
    getClassName: function() {
      return "Node";
    }
  });


  /*
    A normal state in the tree.
  */
  var State = Node.extend({
    transition: function() {
      return this;
    },

    // run the behaviour associated with this state
    run: function() {
      this.states[this.identifier].call(this.actor); // run the action
    }
  }, {
    getClassName: function() {
      return "State";
    }
  });

  /*
    A pointer state in the tree.  Directs the actor to a synonymous state
    further up the tree.  Which synonymous state the actor transitions to
    is dependent on the pointer's strategy.
  */
  var Pointer = Node.extend({
    // transition out of this state using the state's strategy
    transition: function() {
      return this[this.strategy].call(this);
    },

    // a strategy that moves to the first synonymous ancestor
    hereditory: function() {
      return this.nearestNamesakeAncestor(this.identifier);
    }
  }, {
    getClassName: function() {
      return "Pointer";
    }
  });
})();
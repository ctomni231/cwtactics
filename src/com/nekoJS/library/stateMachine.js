neko.define("stateMachine",function(){

    var addEvent = function(stM, e){

        var from = (e.from instanceof Array) ? e.from : [e.from];
        stM._events[e.name] = stM._events[e.name] || {};

        var end = from.length;
        for (var n = 0 ; n < end; n++ ){
            stM._events[e.name][from[n]] = e.to;
        }
    };

    var buildEvent = function( name, map ) {

        return function() {

            var from = this._active;
            var to = map[from];

            if( this.cannot(name) ){
                throw new Error("NoTransitionAvailable",
                    "Event "+name+" innapropriate in current state "+from );
            }

            // trigger onEvent
            var onEvent = this['onEvent'];
            if( onEvent ){

                if( onEvent.apply(this, arguments) === false ){

                    // a return false stops a possible transition
                    return;
                }
            }

            // circling events aren't real transitions
            if ( from != to){

                // trigger onTransition
                var enterState = this['onTransition'];
                if( enterState ){
                    enterState.apply(this, arguments);
                }

                // set new active state
                this._active = to;
            }
        }
    };

    var StateMachine = neko.Class({

        constructor : function( cfg ){

            if( !( cfg.events instanceof Array ) ){
                throw "StateMachine, IllegalArgument";
            }

            if( typeof cfg.initial !== 'string' ){
                throw "StateMachine, init state must be set";
            }

            // properties
            this._events = {};
            this._active = cfg.initial;

            // connect events
            var e = cfg.events.length;
            for( var n = 0; n < e; n++ ){
                addEvent( this, cfg.events[n] );
            }

            // set events
            for( var name in this._events ) {
                if ( this._events.hasOwnProperty(name)){
                    this[name] = buildEvent(name, this._events[name]);
                }
            }
        },

        getState : function() {
            return this._active;
        },

        isActive : function(state) {
            return this._active == state;
        },

        can : function(event) {
            return !!this._events[event][this._active];
        },

        cannot : function(event) {
            return !this.can(event);
        }
    });


    // module API
    return{

        VERSION : 0.8,

        StateMachine : StateMachine
    }
});
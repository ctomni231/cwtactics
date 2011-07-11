(function(){

    // MEOW STATE MACHINE MODULE
    // =========================
    //
    // HEAVILY INSPIRED BY STATE MACHINE IMPLEMENTATION FROM:
    // https://github.com/jakesgordon/javascript-state-machine
    //
    // THIS IMPLEMENTATION TAKES THE BASE IDEA FROM THE ORIGINAL MODULE AND
    // MODIFIES IT, TO FIT A BIT BETTER WITH THE MEOW SYSTEM.
    //
    // LICENSE: THIS MODULE IS RELEASED ( NOT LIKE THE MOST MEOW MODULES ) NOT
    //          UNDER THE MEOW LICENSE. IT TAKES THE ORIGINAL LICENSE OF
    //          https://github.com/jakesgordon/javascript-state-machine,
    //          DUE THE HEAVY INSPIRATIONS FROM THE STATE MACHINE FROM
    //          JAKES GORDON.
    //          
    // SINCE: 10.07.2011
    //======================================================================

    meowEngine.StateMachine = {

        create: function(cfg) {

            if( !( cfg.events instanceof Array ) ){
                throw "StateMachine, IllegalArgument";
            }

            if( typeof cfg.initial !== 'string' ){
                throw "StateMachine, init state must be set";
            }

            // (private) variables
            ///////////////////////

            var instance = cfg.target || {};
            var events = {};
            var active = cfg.initial;


            // inner functions
            ///////////////////

            var addEvent = function(e){

                var from = (e.from instanceof Array) ? e.from : [e.from];
                events[e.name] = events[e.name] || {};

                var end = from.length;
                for (var n = 0 ; n < end; n++ ){
                    events[e.name][from[n]] = e.to;
                }
            };

            var buildEvent = function( name, map ) {

                return function() {

                    var from = active;
                    var to = map[from];

                    if( this.cannot(name) ){

                      throw meowEngine.createError("NoTransitionAvailable",
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
                        active = to;
                    }
                }

            };


            // logic
            /////////

            var e = cfg.events.length;
            for( var n = 0; n < e; n++ ){
                addEvent( cfg.events[n] );
            }

            for( var name in events ) {
                if (events.hasOwnProperty(name)){
                    instance[name] = buildEvent(name,events[name]);
                }
            }

            // build instance class body
            /////////////////////////////

            instance.getState = function() {
                return active;
            };

            instance.isActive = function(state) {
                return active == state;
            };

            instance.can = function(event) {
                return !!events[event][active];
            };

            instance.cannot = function(event) {
                return !this.can(event);
            };

            // return instance
            return instance;
        }
    };

})();
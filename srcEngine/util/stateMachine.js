util.createStateMachine = function( state, factory ){

  return {

    state:function(){
      return state;
    },

    event:function( event ){
      if( DEBUG ){
        util.logInfo("got event",event);
      }

      var descr = factory[state][event];

      if( DEBUG && descr === undefined ){
        util.illegalArgumentError("event "+event+" not defined ");
      }

      // SET STATE
      state = ( typeof descr === "function" )?
        descr.apply( controller.input, arguments ): descr;

      if( DEBUG ){
        util.logInfo("enter new state",state);
      }

      if( DEBUG && !factory.hasOwnProperty(state) ){
        util.illegalArgumentError("state "+state+" is not defined");
      }

      descr = factory[state].onenter;
      if( descr !== undefined ){
        descr.apply( controller.input, arguments );
      }

      descr = factory[state].actionState;
      if( descr !== undefined ){
        controller.input.event( "actionState" );
      }
    }
  };
};
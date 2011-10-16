neko.module "neko.tbs.stateMachine", ( require, exports ) ->  
  ###
    Neko state machine implementation. 
    Implements a very basic implementation for realizing
    state machines. Furthermore, neko state machine allows
    hooking functions between the transitions. 
  ###

  exports.FINITE   = 0
  exports.INFINITE = 1
  
  exports.START_STATE = "_start_state"
  exports.END_STATE   = "_halt_state"
  
  exports.stateMachine = ( events ) ->
    
    # private variables, used by the returned state machine
    _states      = {}
    _activeState = null
    _finalized   = no
    
    generateEvent = ( transitions ) ->
      return () ->
        to = _states[ _activeState ][ event ]
        _activeState = to if to?
    
    setTransition = ( from, to, event, override = no ) ->
      if from?.constructor isnt String or from.length  is 0
           to?.constructor isnt String or to.length    is 0 
         event?.construtor isnt String or event.length is 0
         throw new Error "WrongTransition #{transition}"
          
      _states[ from ] = {} unless _states[ from ]?

      if _states[ from ][ event ] and override is no
        throw new Error "Transition #{event} on state #{from} is already set"
          
      _states[ from ][ event ] = to
    
    # inject transitions argument
    if transitions?.constructor is Array
      for transition in transitions
        setTransition transition.from, transition.to, transition.event
    else
      throw new Error "InvalidTransitionArgument; #{transition}"
      
    # create instance with functions
    instance = 
    
      can : ( to ) ->
        map = _states[ _activeState ]
        for own key of map
          return yes if map[key] is to
        return no
        
      cannot : ( to ) -> return if not this.can to then yes else no
        
      getState : -> return _activeState
        
      finalize : -> 
        _activeState = "Init"  # set the initial state
        
        # set all events
        for state of _states
          for event, to of state 
            if not this[event]? # if event function does not exists
              this[event] = generateEvent event
                
        return
      
      putTransition : ( event, from, to ) ->
        setTransition from, to, event
        return
      
      isFinalized : -> return _activeState?
    
    # return the state machine object
    return instance
neko.module "nekoJS.signals", ( require, exports ) ->
  ###
    Name: 
    Neko signal module
  
    Description:
    This module implements a simple global event system for exchanging 
    messages between different program modules.
               
    License: 
    This module is released under the modified MIT license of neko
  
    Todo:
      - add hooking functions ( listeners -> event <- hooks )
  ###
  
  _signals = {}
  _slice = Array::slice
  
  exports.dispatch = (sigName) ->
    signals = _signals[sigName]
    if signals?
      args = _slice.call arguments, 1
      lis.apply null, args for lis in signals
    return
  
  exports.onSignal = (sigName, listener) ->
    if sigName?.constructor isnt String or listener?.constructor isnt Function
      throw new Error "IllegalArguments"
      
    _signals[sigName] = [] if not _signals[sigName]? 
    _signals[sigName].push listener
  
  exports.remove = (sigName, listener) ->
    if sigName?.constructor isnt String or listener?.constructor isnt Function
      throw new Error "IllegalArguments"
      
    a = _signals[sigName]
    i = a.indexOf listener
    if i is -1 then ( array.splice index, 1; yes ) else no
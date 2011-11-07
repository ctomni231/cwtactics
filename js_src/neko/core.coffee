# get the root node of the javascript environment
rootNode = ( -> return @ ).call()

# check neko namespace
throw new Error "neko property is already defined" if rootNode.neko?

# check neko system variables
if NEKO_SYS_JSLOADER?.constructor     is not Function or
   NEKO_SYS_COFFEELOADER?.constructor is not Function or
   NEKO_SYS_LOGGER?.constructor       is not Function or
   NEKO_SYS_SLEEP?.constructor        is not Function or
   NEKO_SYS_JSONLOADER?.constructor   is not Function
  throw new Error "IllegalNekoSystemFunction; one of the system function for"+
                  "nekoJS is not correctly configured"

rootNode.neko = {}
  
#
# module system
# heavily inspired by the common JS module API, but not implements it 
# completely.
#
_modules = {}
p_baseMod = null

rootNode.neko.require = require = ( modName, useCoffee ) ->

  # check modName
  if modName.contrutor is not String or modName.length is 0
    throw new Error "neko.require; illegal module name #{modName}"
    
  mod = _modules[ modName ]
  path = modName.replace /\./g, "/"
  
  # loader function must be able to understand the path without file 
  # extension. Unlike nodejs, it is maybe possible, that environments does 
  # not able to understand the difference at runtime like script invokement
  # over HTML tags. Because of that, neko expect two different loading 
  # functions, NEKO_SYS_COFFEELOADER and NEKO_SYS_JSLOADER.
  if not mod?
    if useCoffee is yes then NEKO_SYS_COFFEELOADER( "#{path}" )
    else                     NEKO_SYS_JSLOADER( "#{path}" ) 
    mod = _modules[ modName ]
  
  return mod
  
  
#
# Defines a new module and registers it in the neko database. If the module
# can registered correctly, the function returns yes.
#
rootNode.neko.module = module = ( modName, implementation ) ->

  unless p_baseMod? 
    p_baseMod = _modules["neko.base"] ? null
  
  # check modName
  if modName.contrutor is not String or modName.length is 0
    throw new Error "neko.module; illegal module name #{modName}" 
  
  # existing module names cannot be reused
  if _modules.hasOwnProperty( modName ) 
    throw new Error "neko.module; module name #{modName} already exists" 
  
  if implementation.constructor is not Function
    throw new Error "neko.module; illegal implementation, must be a function"
    
  # call implementation to generate the export object
  exports = {}
  implementation require, exports, p_baseMod
    
  #TODO: When will the export module freezed? After call or with a special 
  #      function like neko.freezeModules or with a freeze able system
  #      neko.closeModule( modName )
  _modules[ modName ] = exports
    
  return yes

#
# Simple mixIn implementation
#
# based heavily on https://github.com/jashkenas/coffee-script/wiki/Mixins
#
rootNode.neko.mixIn = mixIn = (classes...) ->

  # mixin extension will be done from right ( low priority ) to the left 
  # ( high priority )
  for i in [classes.length-1..0] by -1
    klass = classes[i]
      
    # static properties
    for prop of klass
      @[prop] = klass[prop]
    
    # prototype properties
    for prop of klass.prototype
      getter = klass::__lookupGetter__(prop)
      setter = klass::__lookupSetter__(prop)

    if getter || setter
      @::__defineGetter__(prop, getter) if getter
      @::__defineSetter__(prop, setter) if setter
    else
      @::[prop] = klass::[prop]
  
  return this

if Object.defineProperty
  Object.defineProperty Function.prototype, "mixIn", value : mixIn
else
  Function::mixIn = mixIn


# freeze the neko property
Object.freeze rootNode.neko

# 
# nekoJS base module
#
module "nekoJS.base", ( require, exports ) ->

  throwError = ( name, reason ) ->
    msg = name
    if reason? then msg += ";"+reason
    throw new Error( msg )
    
  exports.VERSION = "3.0.0 BETA-1"
    
  error = 
    notImplementedYet: ( reason ) ->
      throwError( "NotImplementedYet", reason )
      
    illegalArgs: ( reason ) ->
      throwError( "IllegalArguments", reason )
      
    notAllowed: ( reason ) -> 
      throwError( "NotAllowed", reason )

    expectError: ( desc ) ->
      throwError( "ExpectError", desc )
  
  Object.freeze error
  exports.error = error
  
  exports.isOneOf = ( object, targets... ) ->
      for i in targets
        if object is i 
          return yes
      return no
  
  checks = {}
  checks.EXPECT      = _exp  = 0
  checks.TYPE_OF     = _tOf  = 1
  checks.IN_IN       = _isIn = 2
  checks.PROPERTY_OF = _prOf = 3
   
  exports.checks = checks
  checks = null
    
  ##
  # Nekos magic expect function ;)
  # The idea of this function base heavily on the behaviour driven library
  # jasmine. But instead of using a large amount of nested functions, nekos
  # expect function uses plain iteration algorithms and allows a very handy
  # syntax of defining checks. The niced syntax can be achivied with 
  # CoffeeScript.
  #
  # @example
  #
  # Original way of jasmine:
  # ========================
  #
  # it descriptionText, ->
  #  expect( value ).yourCheckMethod args
  #  expect( value ).yourCheckMethod(args).yourCheckMethod2(args) 
  #
  #
  # Nekos way of expect:
  # ====================
  #
  # style type A
  # base.inspect descriptionText,
  #  EXPECT
  #  obj.value
  #  IS_PROPERTY_OF
  #  obj2
  #
  #  EXPECT
  #  obj.value2
  #  IS_GREATER
  #  10
  #
  # style type B
  # base.inspect descriptionText,
  #  EXPECT, obj.value, IS_PROPERTY_OF, obj2
  #  EXPECT, obj.value, IS_GREATER, 10
  #
  # 
  # We prefere style by, because you can write every expect value statement 
  # on a single line.
  #
  exports.inspect = ( header, args... ) ->
    
    if args.length < 5 
      error.illegalArg "the inspect header must have at least 5 elements "+
                       "[DESCRIPTION,EXPECT,value,COMPARE_ID,expValue,...]"
    if args[1] is not _exp
      error.illegalArg "the second argument in the inspect header has to be "+
                       "EXPECT, to set a first compare able value"
    
    e = args.length
    for i in [1..(e-1)] by 2
      cID = args[i]
      val = args[i+1]
      
      # check the different compare IDs 
      switch cID
        
        # resets the current expect value..
        # all following comparisons will be done with that value now
        when _exp
          value = val
          
        # is the type (constructor) of the value the same as the expected one?
        when _tOf
          if not value.constructor is val
            error.expectError "expected a number but got #{value.constructor}"

        # is the value a property of an object?
        when _prOf
          if val.hasOwnProperty value
            error.expectError "#{value} should be a property of #{val}, "+
                              "but it inst" 
        
        # wrong/unknown inspect command ID
        else error.illegalArgument "unknown 'expect' keyword ID (#{c})"
        
    return



  exports.fromJSON = JSON.stringify
  
  exports.toJSON = JSON.parse
    
  exports.isBlankString = ( str ) ->
    return /^\s*$/.test str
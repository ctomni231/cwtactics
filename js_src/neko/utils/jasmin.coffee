neko.module "neko.utils.jasmine", ( require, exports ) ->
  ###
    Name: 
    Neko jasmine module for behaviour driven development
  
    Description:
    This module injects jasmine into neko js as a module. Futhermore this 
    module injects various useful wrappers into the jasmine system. The jasmine
    library itself must be located under $NEKO_EXT_LIB/jasmin/jasmin.js.
               
    License: 
    This module is released under the modified MIT license of neko
  
    Todo:
      - implement key functions as delegations into the module 
  ###
  
  exports.VERSION = 
    major:0, 
    minor:8, 
    build:1
  
  # include original jasmin library 
  NEKO_SYS_JSLOADER( "#{NEKO_EXT_LIB}/jasmin/jasmin.js" ) unless @jasmine?
  
  # extend jasmin matcher prototype
  matcher = jasmine.Matcher
  
  matcher::isInteger = () ->
    ###
    Checks that the actual property is an integer
    ###
    
    x = parseInt @actual; 
    
    if isNaN x then return no 
    return x is @actual and x.toString() is @actual.toString()
  
  matcher::isObject = () ->
    ###
    Checks that the actual property is an object. This function will check a 
    plain object, not an instance of a class!
    ###
    
    return @actual.constructor is Object
  
  matcher::isString = () ->
    ###
    Checks that the actual property is a string
    ###
    
    return @actual.constructor is String
    
  matcher::isString = () ->
    ###
    Checks that the actual property is a string and not empty
    ###
    
    return @actual.constructor is String and @actual.length > 0
    
  matcher::greater = ( val ) ->
    ###
    Checks that the actual property is greater than a given value
    ###
    return @actual > val

  matcher::greaterEquals = ( val ) ->
    ###
    Checks that the actual property is greater equals than a given value
    ###
    return @actual >= val
  
  matcher::lower = ( val ) ->
    ###
    Checks that the actual property is lower than a given value
    ###
    return @actual < val

  matcher::lowerEquals = ( val ) ->
    ###
    Checks that the actual property is lower equals than a given value
    ###
    return @actual <= val
    
  matcher::propertyOf = ( obj ) ->
    ###
    Checks that the actual property is a property key of a given object
    ###
    return obj.hasOwnProperty @actual
    
  matcher::noPropertyOf = ( obj ) ->
    ###
    Checks that the actual property is not a property key of a given object
    ###
    return not( obj.hasOwnProperty @actual )
    
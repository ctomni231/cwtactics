###
         Name: nekoJS jasmine wrapper module
  Description: This module injects jasmine into neko js as a module. 
               Futhermore this module injects various useful wrappers into
               the jasmine 
###
neko.define "nekoJS.jasmine", ( require, exports ) ->
  
  # include original jasmin library
  NEKO_INCLUDE_JS( NEKO_EXT_LIB+"jasmin/jasmin.js" )
  
  # extend jasmin matcher prototype
  matcher = jasmine.Matcher
  
  #
  # Checks that the actual property is an integer
  #
  matcher::isInteger = () ->
    x = parseInt @actual; 
    
    if isNaN x then return no 
    return x is @actual && x.toString() is @actual.toString()
  
  #
  # Checks that the actual property is an object. This function will check a 
  # plain object, not an instance of a class!
  #
  matcher::isObject = () ->
    return @actual.constructor is Object
  
  #
  # Checks that the actual property is a string
  #
  matcher::isString = () ->
    return @actual.constructor is String
    
  #
  # Checks that the actual property is a string and not empty
  #
  matcher::isString = () ->
    return @actual.constructor is String and @actual.length > 0
    
  #
  # Checks that the actual property is greater than a given value
  #
  matcher::greater = ( val ) ->
    return @actual > val

  #
  # Checks that the actual property is greater equals than a given value
  #
  matcher::greaterEquals = ( val ) ->
    return @actual >= val
    
  #
  # Checks that the actual property is lower than a given value
  #
  matcher::lower = ( val ) ->
    return @actual < val

  #
  # Checks that the actual property is lower equals than a given value
  #
  matcher::lowerEquals = ( val ) ->
    return @actual <= val
    
  #
  # Checks that the actual property is a property key of a given object
  #
  matcher::propertyOf = ( obj ) ->
    return obj.hasOwnProperty @actual
    
  #
  # Checks that the actual property is not a property key of a given object
  #
  matcher::noPropertyOf = ( obj ) ->
    return not( obj.hasOwnProperty @actual )
    
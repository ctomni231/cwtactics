neko.module "neko.utils.i18N", ( require, exports ) ->
  ###
    Name: 
    Neko i18N module
  
    Description: 
    i18N is a very simple module to provide basic localizing support for your
    applications.
               
    License: 
    This module is released under the modified MIT license of neko
    
    ToDo: 
      - bugfixing until version 1.0.0
      - allow XML language sfiles
  ###
  
  exports.VERSION = 
    major:0, 
    minor:9, 
    build:0
    
  data = null   #
  lang = null   # language identifier, all files loads with that identifier
  overR = null  # overriding flag, can later loaded file override old keys?
	
	exports.initialize = ( language, override ) ->
    ###
	  Initializes the language module and sets the language identifier.
	  
	  @param {String} language language identifier
	  @param {Boolean} override if true/yes language files can override already
	                   existing localization keys
	  ###
	  
    throw new Error "neko.i18N is already initialized" if langName? 
    
    if require("neko.core").isBlankString language
      throw new Error "language parameter has to be a valid string"
    else
      lang = language
    
    overR = override is yes ? no
	
  exports.include = ( path ) ->
    ###
      Includes a language file into the localization database.
      
      @param {String} path contains the path to the file, without the 
                           language identifier ( e.g. path="/myLang" on 
                           language "EN" will converted to 
                           "/lang/myLang_EN.json")
    ###
    
    if not path.indexOf ".." is -1 
      throw new Error "path contains an illegal '..' pattern"
              
    _data = require("nekoJS.core").parseJSON "#{path}_#{lang}.json"
    for own el of _data 
      # if override flag is no, then stop the
      # write process and go to the next key
      if data[el]? and not overR then continue
      
      data[ el ] = _data[el]
   
  exports.isInitialized = ->
    ###
    Returns true, if the data core is already initialized, else false.
    ###
    return data?
    
    
  exports.getLanguage = () -> 
    ###
    Returns the identifier of the active language or NONE, if no language 
    is set.
    ###
    return lang ? "NONE" 
  
    
  exports.get = ( ID ) -> 
    ###
    Returns the localized string for an identical identifier
    ###
    return data[ID] ? ID
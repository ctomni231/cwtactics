###
           Name: NekoJS i18N module
    Description: i18N is a very simple module to provide basic localizing 
                 support for your applications
           ToDo: - remove pre defined languages; allow predefine able custom
                   language tags, that will be dynamically append to the 
                   searched language files.. 
                   e.g. tag: myLang will search lang_myLang.lang
				 - implement loading algorithm
###
neko.define "neko.i18N", ( require, exports ) ->
    
	exports.VERSION = 0.5
	
    # get modules
    json = require("nekoJSON",1.0,"MAX")
    
    # available languages on neko
    languages = [
        "de"
        "en_US"
        "en_GB"
        "fr"
    ]
    
    initialized = no
    stringDB    = {}
    
    #
    # Initiliazes the module with a given language ID.
	# Returns true, if the module is initialized successfully.
    #
    exports.initialize = ( language ) ->
        throw new Error "neko.i18N is already initialized" if initialized 
        
        # load language files
        initialized = yes
    
    #
    # Returns yes, if a language is initialized, else no
    #
    exports.isInitialized = -> return initialized
    
    #
    # Returns the localized string of an ID, 'undefined' if no localized
    # string is available for the given ID.
    #
    exports.get = ( ID ) -> return stringDB[ID]
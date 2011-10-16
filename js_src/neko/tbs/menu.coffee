neko.module "neko.tbs.menu", ( require, exports ) ->
  ###
  neko.menu defines the structure of the menu and it's actions. 
  A menu is normally called by a client and every menu entry 
  contains a name, a locallized string and an action callback.
  ###
  
  
  #! UPDATE HERE IF THE NEKO CORE IS INJECTED !#
  keys = require("neko.input").keyMap
  KEY_UP = keys["KEY_UP"]
  KEY_DOWN = keys["KEY_DOWN"]
  delete keys 
  
  exports.MenuItem = class MenuItem  
    ###
    @param {Function} callback called if the button is triggered
                          by an instance
    @param {String} localized string that will be printed by the 
                    graphic client on the screen 
    ###

    trigger: () ->
        @callback? this
    
    toString: () -> 
        return @localized
       
       
  exports.SubMenuItem = class SubMenuItem extends MenuItem
    ###
    Special menu entry, that contains one or more sub menu entries.
    @param {} entries array of menu entries
    ###
  
    constructor: () ->
      @entries = []
    
    trigger: () -> 
      ### trigger has no action in a sub menu ###
      return
      
    clear: () ->
      @entries.clear()     
      

  exports.Menu = class Menu
    
    constructor: () ->
      @entries = []
      
    @makeSelectable: ( menu ) ->
      if menu? instanceof Menu 
        #! Update if neko.core has the class methods !#
        require("neko.core").mixIn menu, Selectable
      else 
        throw "menu must be an instance of cwt.menu.Menu"
    
      
  exports.Selectable = class Selectable
    ###
      Selectable is a trait for the Menu class. Every menu can 
      mixIn this trait to add a keyEvent function. This function
      allows the interaction with the menu.
    ###
    
    @_selected: 0
    
    keyEvent: ( keyID ) ->
      if keyID is KEY_UP
        @_selected++ unless @_selected >= @entries.length
      else
        @_selected-- unless @_selected is 0 
        
        
      
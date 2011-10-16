neko.define "cwt.menu", ( require, exports ) ->
  ###
    custom wars tactics menu module.
  ###
  
  props = require "neko.properties"
  MAX_ENTRIES = props.get "CWT_MAX_MENU_ENTRIES"
  MAX_PER_PAGE = props.get "CWT_MAX_MENU_ENTRIES_PER_PAGE"
  
  menu = require "neko.menu"
  
  _menu_instance = new menu.Menu()
  
  # allow default selectable features
  menu.Menu.makeSelectable _menu_instance 
  
  
# 
#        Name: data.database module 
# Description: This module contains various functions to define model sheets.
#              At all, this module holds all available type definitions of 
#              the cwt engine.
#     Changes: - reuses complete json models instead of copying the content
#        ToDo: - move freeze wrappers and so on outside
#              - no freeze of sheets after parsing... leave them alterable 
#                the initialization process is done ( and mod scripts, that
#                can alter the model/data, parsed too ) 
#
neko.module "data.database", ( require, exports ) ->

  # get jasmine module functions
  it       = require("jasmine").it
  describe = require("jasmine").describe
  expect   = require("jasmine").expect
  
  # safe wrapper, if no native support available, an empty function will
  # called
  freeze = Object.freeze ? () -> return
  
  # db entries
  tiles     = {}
  units     = {}
  weapons   = {}
  weathers  = {}
  movetypes = {}

  #
  # This function validates an unit sheet object and registers it in the 
  # database.
  #
  exports.unitSheet = ( json ) ->

    describe "unitSheet; checking properties", ->
  
      it "sheet object", ->
        expect(json).isObject()
  
      it "ID", -> 
        expect(json.ID).validString().noPropertyOf( units )
      
      if json.maxAmmo?
        it "maxAmmo", ->
          expect(json.maxAmmo).isInteger().greaterEquals(0)

      it "maxFuel", ->
        expect(json.maxFuel).isInteger().greaterEquals(0)
      
      it "vision", ->
        expect(json.vision).isInteger().greaterEquals(0).lowerEquals(15)

      it "captureRate", ->
        expect(json.captureRate).isInteger().greater(0)
    
      it "weight", ->
        expect(json.weight).isInteger().greaterEquals(1)

      it "moveRange", ->
        expect(json.moveRange).isInteger().greaterEquals(0).lowerEquals(15)
    
      it "cost", ->
        expect(json.cost).isInteger().greaterEquals(1)
      
      it "moveType", ->
        expect(json.moveType).isString().propertyOf(moveTypes)
      
      it "canLoad", ->
        expect(json.canLoad).isInteger().greater(0)
      
      if json.supply?
        for target in json.supply
          it "supply ID:#{target}", -> expect(target).validString()
        return
      
      if json.transport?
        for target in json.transport
          it "transport ID:#{target}", -> expect(target).validString()
        return
      
      # weapons must be an array of strings and valid ID's for weapon sheets
      if json.weapons?
        for weapon in json.weapons
          it "tag:#{weapon}", -> expect(tag).isString().propertyOf(weapons)
        if json.weapons.length > 0 and not json.maxAmmo?
          throw new Error "unitSheet; weapons defined, but not maxAmmo"
              
      for tag in json.tags
        it "tag:#{tag}", -> expect(tag).isString()
        
      return # prevent for loop overhead due return array as last expression
    
    # check loading attributes, if one exists n, both must exists
    if ( json.canLoad? and not json.transport? ) or
       ( not json.canLoad? and json.transport? )
        throw new Error "one transport property is missing on #{json.ID}"
    
    freeze( json ) # prevent altering on the sheet
    units[ json.ID ] = json


  #
  # This function validates a tile sheet object and registers it in the 
  # database.
  #
  exports.tileSheet = ( json ) ->
    
    describe "tileSheet; checking properties", ->
  
      it "sheet object", ->
        expect(json).isObject()
  
      it "ID", -> 
        expect(json.ID).validString().noPropertyOf( tiles )
      
      it "capturePoints", ->
        expect(json.capturePoints).isInteger().greaterEquals(0)
                                              .lowerEquals(1000)
      
      if json.funds? 
        it "funds", ->
          expect(json.funds).isInteger().greater(0)
          
      if json.vision? 
        it "vision", ->
          expect(json.vision).isInteger().greaterEquals(0)
        
      if json.repairs?                                      
        it "repairs", ->
          for key,value of json.repairs
            it "tag:#{key}", -> 
              expect(key).validString()
              expect(value).isInteger().greater(0)
          return # for is last expression in it(...){}
                                              
      for tag in json.tags
        it "tag:#{tag}", -> expect(tag).isString()
      
      return # prevent for loop overhead due return array as last expression

    freeze( json ) # prevent altering on the sheet
    tiles[ json.ID ] = json 
    
    
  #
  # This function validates a weapon sheet object and registers it in the 
  # database.
  #   
  exports.weaponSheet = ( json ) ->
  
    describe "weaponSheet; checking properties", ->
  
      it "sheet object", ->
        expect(json).isObject()
  
      it "ID", -> 
        expect(json.ID).validString().noPropertyOf( weapons )
        
      it "fireType", ->
        expect(json.fireType).validString()
        
      it "usesAmmo", ->
        expect(json.usesAmmo).isInteger().greaterEquals(0)
      
      it "damageMap", ->
        expect(json.damageMap).isObject()
        for key, value of json.damageMap
          expect(key).validString() # tag support ? ATM unclear
          expect(value).isInteger().greater(0)
        return # prevent for loop overhead due return array as last expression
      
    freeze( json ) # prevent altering on the sheet
    weapons[ json.ID ] = json


  #
  # This function validates a move sheet object and registers it in the 
  # database.
  #
  exports.moveSheet = ( json ) ->
   
    describe "weatherSheet; checking properties", ->
  
      it "sheet object", ->
        expect(json).isObject()
  
      it "ID", -> 
        expect(json.ID).validString().noPropertyOf( movetype )
        
      it "costs", ->
        expect(json.costs).isObject()
        for key, value of json.costs
          expect(key).validString() # tag support ? ATM unclear
          expect(value).isInteger().greater(0)
        return # prevent for loop overhead due return array as last expression
            
    freeze( json ) # prevent altering on the sheet
    freeze( json.costs ) 
    movetype[ json.ID ] = json
    
    
  #
  # This function validates a weather sheet object and registers it in the 
  # database.
  #
  exports.weatherSheet = ( json ) ->
   
    describe "weatherSheet; checking properties", ->
  
      it "sheet object", ->
        expect(json).isObject()
  
      it "ID", -> 
        expect(json.ID).validString().noPropertyOf( weathers )
      
      it "chance", ->
        expect(json.chance).isInteger().greater(0)
      
    freeze( json ) # prevent altering on the sheet
    weathers[ json.ID ] = json
  

  # returns the available sheets in the database
  exports.movetype  = ( ID ) -> movetypes[ ID ]
  exports.unit      = ( ID ) -> units[ ID ]
  exports.tile      = ( ID ) -> tiles[ ID ]
  exports.weather   = ( ID ) -> weathers[ ID ]
  exports.weapons   = ( ID ) -> weaponss[ ID ]
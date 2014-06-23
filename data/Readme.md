# CWT Map Definition (Version 0.4)

----

## Introduction

This page was written so I can have a quick reference for the MAP data for JSON. I was hoping that just a page explaining it would serve as a proper reference. To prevent it from being read as a map, I am putting it in the data section for anyone who is interested in creating maps for CWT.

## Example Map

Maps are written in pure JSON format using the [Image Abbreviations](https://github.com/ctomni231/cwtactics/tree/master/image#image-abbreviations). More details about the different parts are detailed below.

### Map Name (Name)

* "name" : "Spann - Island"

Holds the name of the map

### Author (Credits)

* "credits" : "AW War Room"

Holds the designers of the map

### Game [Prospect Design]

* "game" : "AW1 - Advance Wars 1"

The name of the game this map comes from

* "game" : "CWB - Custom Wars Beta 27 - Ad-Hoc Commander"

Alternate writing for modifications and abbreviations

### TypeMap

* "typemap" : ["PLIN","MNTN","FRST", (...) ,"BRDG" ]

Holds an array list of [Tag Abbreviations](https://github.com/ctomni231/cwtactics/tree/master/image#terrain-types) that will be referenced from this map.

* PLIN=>0 , MNTN=>1, FRST=>2, ... etc.

Each tag type is pinned onto an index which is used by the "map" below

### Map

* "map" : [[5, 5, 5, 5, (...), 5],[(...)]]

Using the indexes above, creates a map using the abbreviations. The map indexes are laid out using a double array format. The inner array represents the x-axis while the outer represents the y-axis. It must correspond to the map width and map height below.

### Map Height (mph)

* "mph" : 12

This holds the map height represented in tiles.

### Map Width (mpw)

* "mpw" : 16

This holds the map width represented in tiles.

### Player

* "players" : 2

This holds the number of players in the map

### Properties (prps)

* "prps" : [[0, 2, 7, "HQTR", 20, 0],[(...)]]

This holds a list of properties within the map

* [(PropID), (X-axis Position), (Y-axis Position), (Tag Abbreviation), (Capture Points), (Owner)]

* **PropID**: The unique property ID in the map (must be unique)
* **X-axis pos**: The X-axis location in tiles of this property
* **Y-axis pos**: The Y-axis location in tiles of this property
* **Tag Abbrev**: The 4-letter tag name of this property
* **Capture Points**: The amount of starting capture points
* **Owner**: The owner of this property (-1 for neutral)

### Units 

* "units" : [[0, "INFT", 1, 1, 99, 0, 99, -1, 0],[(...)]]

This holds a list of units within the map

* [(UnitID), (Tag Abbreviation), (X-axis Position), (Y-axis Position), (Hit Points), (Ammo), (Fuel), (loaded In), (Owner)]

* **UnitID**: The unique unit ID in the map (must be unique)
* **Tag Abbrev**: The 4-letter tag name of this unit
* **X-axis pos**: The X-axis location in tiles of this unit
* **Y-axis pos**: The Y-axis location in tiles of this unit
* **Hit Points**: The HP (or remaining health) of this unit
* **Ammo**: The remaining primary ammo count of this unit
* **Fuel**: The remaining fuel count of this unit
* **Loaded In**: The unique ID of the unit this is loaded into
* **Owner**: The owner of this unit (-1 for neutral)

### Daily Events (dyev) [Under Construction]

* "dyev" : ?

Holds the daily events for campaign missions

### Rules [Under Construction]

* "rules" : ?

Holds the campaign and map rules [Under Construction]

### Army Faction (army) [Prospect Design]

* "army" : ["OS", "BH", "BM", (...) ,"YC" ]

This allows you to choose the color scheme for the players. Binds each player to an ID.

* OS => 0, BH => 1, BM => 2

In the future, colors may be used to determine the turn order. However, currently, it is just to make players display using a certain color scheme.

### Layout [Prospect Design - Unlikely to Happen]

* "layout" : "4"

This allows you to set up the type of map for 4-way (normal) or 6-way (hex). 
Not available in the game, but allows maps to have the options of following two schemes.
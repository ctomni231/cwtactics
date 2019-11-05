# Attention: New Image Format

## Introduction

After a lot of testing and organizing, the new image format is finally completed. This format will make it easier for us to show connections of terrain directly from the images. It will also be used for units, inventions, and properties to allow display of the different armies.

## Enhancements

The new image convention allows for a lot more flexibility than its predecessor.

* Connection Type allows for multiple connections ex. (SB)
* Connection Type allows all letters and numbers for multiple connection types. Accepts characters (A-Z)(a-z)(~)(0-9).
* Better support for weather, connections, and direction

## Format

`AWDS(C)_PLIN$~~~~~~~~`

`AWDS(C)_INFT_OS`

`<Game Type>(<Weather Type>)_<Object Type>(<Connection Type>)_<Faction Type>-<Direction>$<8-Way Connection>`

`<Game Type>(<Weather Type>)_<Object Type>(<Connection Type>)_<Faction Type>-<Direction>%<List Connection>_<List Connection>_...`

*Game Type:* This is the abbreviation for the objects game origin.  
*Weather Type*: This is the abbreviation for the objects weather type.  
*Object Type*: This is the 4-letter abbreviation for the object.  
*Connection Type*: This is the type of connection this tile connects with.  
*Faction Type*: This is the abbreviation for the type of faction this object represents.  
*Direction*: This is the abbreviation for the direction this object is facing.   
*8-way Connection*: This orders the connections for N-S-W-E-NW-NE-SW-SE to show the best combination of connection for a certain tile.

*List Connection*: Ox-1y0 - This uses a list to show how much (x,y) distance a tile must be away from another tile to form a connection.

### Folder Format

Each folder will be used to separate the images. There will be a folder for each group of images and the corresponding animations.

* Terrain
* Properties
* Inventions
* Units

For extra images, like battle animations and overworld images, these folder sections will be denoted with a dash with the corresponding names. Image conventions will remain relatively the same for each image, with slight variations when needed.

* Terrain - Overworld
* Units - BattleAnim

***

# Image Organization

This shows how objects are organized within the object files for units, terrain(fields), and properties(buildings/inventions).

## Unit (animation by columns...)

`[wait1][wait2][wait3][north1][north2][north3][south1][south2][south3][west1][west2][west3]`

## Terrain & Properties (animation by columns...)

`[anim1][anim2][anim3][anim4]`

***

# Image Abbreviations

## Cursor and Terrain Connection Image Abbreviations

* *~* = Land/Neutral/Wildcard
* *W* = Wall
* *S* = Sea/Ocean
* *B* = Shoal/Beach
* *R* = River/Shallow
* *O* = Road/Bridge
* *P* = Pipe/PipeSeam
* *Z* = Meteor/Plazma
* *D* = Destroyed

## Tileset Types

* *AW1* = Advance Wars 1
* *AW2* = Advance Wars 2
* *AWDS* = Advance Wars Dual Strike
* *AWDR* = Advance Wars Days of Ruin/Dark Conflict
* *CW* = Custom Wars (Original)
* *CWT* = Custom Wars Tactics [Default]

## Unit Types - Direct Land

* *INFT* = Infantry
* *MECH* = Mech
* *BIKE* = Bike
* *SNIP* = Sniper
* *RECN* = Recon
* *AAIR* = Anti-Air
* *APCR* = APC Rig
* *TANK* = Tank
* *MDTK* = Medium Tank
* *NTNK* = Neo-Battle Tank
* *WRTK* = Mega Wartank
* *SPTK* = Spider-Tank
* *BCRT* = Battle-Hovercraft
* *OOZM* = Oozium
* *FLRE* = Flare

## Unit Types - Indirect Land

* *ARTY* = Artillery
* *RCKT* = Rockets
* *MISS* = Missiles
* *PRNR* = Piperunner
* *ATNK* = Anti-Tank
* *ACRT* = Artillery-Hovercraft

## Unit Types - Air

* *TCTR* = Transport-Helicopter
* *BCTR* = Battle-Helicopter
* *FGTR* = Jet Fighter 
* *BMBR* = Bomber
* *BKBM* = Black Nuclear-Bomb
* *STLH* = Stealth
* *SEAP* = Seaplane
* *DUST* = Duster
* *ZPLN* = Zeppelin
* *SPYP* = Spyplane
* *HCTR* = Heavy-Helicopter

## Unit Types - Sea

* *BSHP* = Battleship
* *CRUS* = Cruiser
* *SUBM* = Submarine
* *LNDR* = Lander
* *BKBT* = Black Patrol-Boat
* *ACAR* = Aircraft-Carrier
* *GNBT* = Gunboat
* *DSYR* = Destroyer

## Unit Types - Obsolete

* *SRNR* = Shuttle-Piperunner

## Terrain Types

* *PLIN* = Plain
* *FRST* = Forest
* *MNTN* = Mountain
* *RIVR* = River
* *ROAD* = Road
* *BRDG* = Bridge
* *REEF* = Reef
* *WTLD* = Wasteland
* *RUIN* = Ruins
* *SHOA* = Shoals
* *SEAS* = Seas
* *METR* = Meteor
* *PLZM* = Plasma
* *PLZP* = Plazma Pipe
* *PZPS* = Plazma Pipeseam
* *PIPE* = Pipe
* *PIPR* = Piperail
* *SWMP* = Swamp
* *MIST* = Mist
* *RSEA* = Rough Seas
* *FIRE* = Fire
* *NULL* = Null

## Property Types

* *HQTR* = Headquarters
* *CITY* = City
* *BASE* = Factory
* *APRT* = Airport
* *PORT* = Seaport
* *CMTR* = Communication-Tower
* *SILO* = Missile Silo
* *PLTF* = Missile Silo Platform
* *RDAR* = Radar
* *TAPT* = Temporary Airport
* *TSPT* = Temporary Seaport
* *RUBL* = Rubble
* *PIPS* = Pipeseam
* *STRH* = Stronghold
* *LABS* = Lab
* *QURY* = Query
* *ORIG* = Oil Rig
* *WALL* = Wall

## Inventions

* *BHMC* = Black Hole Mini-Cannon
* *BHCN* = Black Hole Cannon (3x3 Tiles)
* *BHDR* = Black Hole Death Ray (3x3 Tiles)
* *BHFR* = Black Hole Fortress (4x4 Tiles)
* *BHFT* = Black Hole Factory (3x3 Tiles)
* *BHLZ* = Black Hole Lazer
* *BHMS* = Black Hole Missile (4x4 Tiles)
* *BRBL* = Big Rubble (3x3 Tiles)
* *SRBL* = Small Rubble
* *VCNO* = Volcano
* *BCRY* = Black Hole Crystal
* *BOBL* = Black Hole Obelisk (3x3 Tiles)
* *BARK* = Black Hole Ark (3x3 Tiles)
* *TGUN* = IDS Talon Gun (3x3 Tiles)
* *DTGN* = IDS Talon Gun Rubble (3x3 Tiles)

## Army Factions

* *GD* = Gray Diamond (Neutral/Freelance)
* *OS* = Orange Star [Default]
* *BM* = Blue Moon
* *GE* = Green Earth
* *YC* = Yellow Comet
* *BH* = Black Hole
* *CR* = Crimson Ray
* *AV* = Arsenic Vortex
* *SS* = Sepia Sun
* *SF* = Scarlet Flare
* *IN* = Ivory Nebula
* *CS* = Cobalt Storm
* *PC* = Pink Cosmos
* *TG* = Teal Gravity
* *IE* = Indigo Eclipse
* *WN* = White Nova
* *CG* = Cream Galaxy
* *MO* = Magneta Orbit
* *JA* = Jade Asteroid

## Weather

* *C* = Clear
* *S* = Snow
* *R* = Rain
* *D* = Sandstorm
* *W* = Windstorm (High Winds)
* *H* = Heatwave
* *T* = Thunderstorm
* *A* = Acid Rain
* *Q* = Earthquake

## Unit Groups

These are groups that make it easier affect many unit statistics at once. This was made specifically for easier interactions with CO abilities.

### @GRD - Ground Unit Group - Terrain Type

* *INFT* = Infantry
* *MECH* = Mech
* *BIKE* = Bike
* *SNIP* = Sniper
* *RECN* = Recon
* *AAIR* = Anti-Air
* *APCR* = APC Rig
* *TANK* = Tank
* *MDTK* = Medium Tank
* *NTNK* = Neo-Battle Tank
* *WRTK* = Mega Wartank
* *SPTK* = Spider-Tank
* *BCRT* = Battle-Hovercraft
* *OOZM* = Oozium
* *FLRE* = Flare
* *ARTY* = Artillery
* *RCKT* = Rockets
* *MISS* = Missiles
* *PRNR* = Piperunner
* *ATNK* = Anti-Tank
* *ACRT* = Artillery-Hovercraft
* *SRNR* = Shuttle-Piperunner

### @WTR - Water Unit Group - Terrain Type

* *BSHP* = Battleship
* *CRUS* = Cruiser
* *SUBM* = Submarine
* *LNDR* = Lander
* *BKBT* = Black Patrol-Boat
* *ACAR* = Aircraft-Carrier
* *GNBT* = Gunboat
* *DSYR* = Destroyer

### @SKY - Sky Unit Group - Terrain Type

* *TCTR* = Transport-Helicopter
* *BCTR* = Battle-Helicopter
* *FGTR* = Jet Fighter 
* *BMBR* = Bomber
* *BKBM* = Black Nuclear-Bomb
* *STLH* = Stealth
* *SEAP* = Seaplane
* *DUST* = Duster
* *ZPLN* = Zeppelin
* *SPYP* = Spyplane
* *HCTR* = Heavy-Helicopter

### @DIR - Direct Unit Group - Firing Type

* *INFT* = Infantry
* *MECH* = Mech
* *BIKE* = Bike
* *SNIP* = Sniper
* *RECN* = Recon
* *AAIR* = Anti-Air
* *APCR* = APC Rig
* *TANK* = Tank
* *MDTK* = Medium Tank
* *NTNK* = Neo-Battle Tank
* *WRTK* = Mega Wartank
* *SPTK* = Spider-Tank
* *BCRT* = Battle-Hovercraft
* *OOZM* = Oozium
* *FLRE* = Flare
* *TCTR* = Transport-Helicopter
* *BCTR* = Battle-Helicopter
* *FGTR* = Jet Fighter 
* *BMBR* = Bomber
* *BKBM* = Black Nuclear-Bomb
* *STLH* = Stealth
* *SEAP* = Seaplane
* *DUST* = Duster
* *SPYP* = Spyplane
* *HCTR* = Heavy-Helicopter
* *CRUS* = Cruiser
* *SUBM* = Submarine
* *LNDR* = Lander
* *BKBT* = Black Patrol-Boat
* *GNBT* = Gunboat

### @IND - Indirect Unit Group - Firing Type

* *ARTY* = Artillery
* *RCKT* = Rockets
* *MISS* = Missiles
* *PRNR* = Piperunner
* *ATNK* = Anti-Tank
* *ACRT* = Artillery-Hovercraft
* *ZPLN* = Zeppelin
* *BSHP* = Battleship
* *ACAR* = Aircraft-Carrier
* *DSYR* = Destroyer

### @INF - Infantry Unit Group - Movement Type

* *INFT* = Infantry
* *SNIP* = Sniper
* *SPTK* = Spider-Tank

### @MEC - Mech Unit Group - Movement Type

* *MECH* = Mech

### @BIK - Bike (Tire-A) Unit Group - Movement Type

* *BIKE* = Bike
* *ATNK* = Anti-Tank

### @THR - Tread Unit Group - Movement Type

* *AAIR* = Anti-Air
* *APCR* = APC Rig
* *TANK* = Tank
* *MDTK* = Medium Tank
* *NTNK* = Neo-Battle Tank
* *WRTK* = Mega Wartank
* *FLRE* = Flare
* *ARTY* = Artillery

### @TIR - Tire (Tire-B) Unit Group - Movement Type

* *RECN* = Recon
* *RCKT* = Rockets
* *MISS* = Missiles

### @AIR - Air Unit Group - Movement Type

* *TCTR* = Transport-Helicopter
* *BCTR* = Battle-Helicopter
* *FGTR* = Jet Fighter 
* *BMBR* = Bomber
* *BKBM* = Black Nuclear-Bomb
* *STLH* = Stealth
* *SEAP* = Seaplane
* *DUST* = Duster
* *ZPLN* = Zeppelin
* *SPYP* = Spyplane
* *HCTR* = Heavy-Helicopter

### @HVR - Hover Unit Group - Movement Type

* *BCRT* = Battle-Hovercraft
* *ACRT* = Artillery-Hovercraft

### @LDR - Lander Unit Group - Movement Type

* *LNDR* = Lander
* *BKBT* = Black Patrol-Boat
* *GNBT* = Gunboat

### @SEA - Sea Unit Group - Movement Type

* *BSHP* = Battleship
* *CRUS* = Cruiser
* *SUBM* = Submarine
* *ACAR* = Aircraft-Carrier
* *DSYR* = Destroyer

### @PIP - Pipe Unit Group - Movement Type

* *PRNR* = Piperunner
* *SRNR* = Shuttle-Piperunner

### @OOZ - Oozium Unit Group - Movement Type

* *OOZM* = Oozium

### @ARH - Air High Flight Unit Group - Movement Type Special

* *FGTR* = Jet Fighter 
* *BMBR* = Bomber
* *BKBM* = Black Nuclear-Bomb
* *STLH* = Stealth
* *SPYP* = Spyplane

### @ARM - Air Medium Flight Unit Group - Movement Type Special

* *SEAP* = Seaplane
* *DUST* = Duster
* *ZPLN* = Zeppelin
* *HCTR* = Heavy-Helicopter

### @ARL - Air Low Flight Unit Group - Movement Type Special

* *TCTR* = Transport-Helicopter
* *BCTR* = Battle-Helicopter

### @VEH - Vehicle Unit Group - Unit Type

* *BIKE* = Bike
* *RECN* = Recon
* *AAIR* = Anti-Air
* *APCR* = APC Rig
* *TANK* = Tank
* *MDTK* = Medium Tank
* *NTNK* = Neo-Battle Tank
* *WRTK* = Mega Wartank
* *SPTK* = Spider-Tank
* *BCRT* = Battle-Hovercraft
* *FLRE* = Flare
* *ARTY* = Artillery
* *RCKT* = Rockets
* *MISS* = Missiles
* *PRNR* = Piperunner
* *ATNK* = Anti-Tank
* *ACRT* = Artillery-Hovercraft

### @SLR - Soldier Unit Group - Unit Type

* *INFT* = Infantry
* *MECH* = Mech
* *BIKE* = Bike
* *SNIP* = Sniper

### @RCN - Reconnaissance Unit Group - Unit Type

* *RECN* = Recon
* *FLRE* = Flare
* *SPYP* = Spyplane

### @TNK - Tank Unit Group - Unit Type

* *TANK* = Tank
* *MDTK* = Medium Tank
* *NTNK* = Neo-Battle Tank
* *WRTK* = Mega Wartank
* *SPTK* = Spider-Tank

### @TRN - Transport Unit Group - Unit Type

* *APCR* = APC Rig
* *TCTR* = Transport-Helicopter
* *CRUS* = Cruiser
* *BKBT* = Black Patrol-Boat
* *ACAR* = Aircraft-Carrier
* *SRNR* = Shuttle-Piperunner

### @CTR - Helicopter Unit Group - Unit Type

* *TCTR* = Transport-Helicopter
* *BCTR* = Battle-Helicopter
* *HCTR* = Heavy-Helicopter

### @PLN - Airplane Unit Group - Unit Type

* *FGTR* = Jet Fighter 
* *BMBR* = Bomber
* *STLH* = Stealth
* *SEAP* = Seaplane
* *DUST* = Duster
* *SPYP* = Spyplane

### @FLT - Floating Unit Group - Unit Type

* *BCRT* = Battle-Hovercraft
* *ACRT* = Artillery-Hovercraft
* *ZPLN* = Zeppelin

### @CAR - Carrier Unit Group - Unit Type

* *CRUS* = Cruiser
* *ACAR* = Aircraft-Carrier

### @STL - Stealth Unit Group - Unit Type

* *SNIP* = Sniper
* *STLH* = Stealth
* *SUBM* = Submarine

### @NUK - Nuke/Bomb Unit Group - Unit Type

* *BKBM* = Black Nuclear-Bomb

### @SHP - Warship Unit Group - Unit Type

* *BSHP* = Battleship
* *CRUS* = Cruiser
* *ACAR* = Aircraft-Carrier
* *GNBT* = Gunboat
* *DSYR* = Destroyer
 
***

# File Organization (Deprecated)

This shows how the file names are organized within the object folders for units, terrain(fields), and properties(buildings/inventions). All files can follow the general file format, but the categories allow users to fine tune the data for specific images.

_*Opt* = Optional_

## General File Format (Deprecated)

`(Tileset)-(Weather[Opt])_(Object)-(Overlap[Opt])_(Army[Opt])~(8-Connection N-S-W-E-NW-NE-SW-SE[Opt])`


## Terrain Format (Deprecated)

`(Tileset Type)-(Weather Type[Opt])_(Terrain Type)-(Overlap Type[Opt])~(4-Connection Type N-S-W-E [Opt])`

## Properties Format (Deprecated)

`(Tileset Type)-(Weather Type[Opt])_(Property Type)-(Overlap Type[Opt])_(Army Faction[Opt])`

## Units Format (Deprecated)

`(Tileset Type)_(Unit Type)_(Army Faction[Opt])`

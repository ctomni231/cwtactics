# Image Organization

This shows how objects are organized within the object folders for units, terrain(fields), and buildings(properties).

## Terrain (animation by rows...)
   
`[ew][ns]  [ne][nw][se][sw]  [new][sew][nse][nsw]  [nsew]  [n][s][e][w][o]`

## Cursor (animation by rows...)

`[ew][ns]  [ne][nw][es][sw]  [n][s][e][w]`

## City  (animation by columns...)

`[anim1][anim2][anim3][anim4]`

## Unit (animation by columns...)

`[wait1][wait2][wait3][north1][north2][north3][south1][south2][south3][west1][west2][west3]`

***

# File Organization

## Terrain

`(Tileset Type)_(Terrain Type)-(Overlap Type[Optional])~(Connection 4-Type N-E-S-W [Optional])`

`(Tileset Type)_(Terrain Type)-(Overlap Type[Optional])~(Connection 8-Type N-NE-E-SE-S-SW-W-NW [Optional])`

## General

`(Tileset Type)_(Object Type)_(Army Faction[Optional])`

***

# Image Abbreviations

## Tileset Types

* *AW1* = Advance Wars 1
* *AW2* = Advance Wars 2
* *AWDS* = Advance Wars Dual Strike
* *AWDR* = Advance Wars Days of Ruin/Dark Conflict
* *CW* = Custom Wars (Original)
* *CWT* = Custom Wars Tactics

## Overlap Types

* *L* = Land (Default)
* *S* = Sea/Ocean
* *B* = Shoal/Beach
* *R* = River/Swamp

## Connection Types

* *3* = Land (Default)
* *2* = Shoal/Beach
* *1* = River/Swamp
* *0* = Sea/Ocean

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
* *ACRT* = Artillery-craft

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

* *SRNR* = Shuttlerunner

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
* *PIPS* = Pipeseam
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
* *SPRT* = Seaport
* *CMTR* = Communication-Tower
* *SILO* = Missile Silo
* *RDAR* = Radar
* *TAPT* = Temporary Airport
* *TSPT* = Temporary Seaport
* *STRH* = Stronghold
* *LABS* = Lab
* *QURY* = Query
* *ORIG* = Oil Rig
* *WALL* = Wall

## Inventions

* (None Yet)

## Army Factions

* *GD* = Gray Diamond (Neutral/Freelance)
* *OS* = Orange Star
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

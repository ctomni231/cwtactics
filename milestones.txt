Milestones 0.36 - BlackCat
--------------------------

M1:
===

[ ] Event Management System 
  [ ] Signals -> does nothing on the side of the invoker 
  [ ] Callbacks -> invokes a callback after computed
[ ] List of object actions [OAL]
  - Callback-Event
    - Input-1: object x
    - Input-2: object y
    - Output: callback(map<positionCode:string, actions:list<{ action:string, additonalArgs }>>)
  - Throws error event when game is not constructed

M2:
===

[ ] Test Suite
  - Will basically a simple event in- and output tester...
    [ ] Injects test maps 
    [ ] Pushes OAL request
    [ ] Asserts OAL response
  - Implementation
    [ ] New parameter -test for build script
    [ ] Test file test.js which will be loaded on startup
    [ ] Results will be revealed in the start screen

M4:
===

[ ] Game construction event
  [ ] Game data
    [ ] Players
    [ ] Map
    [ ] Meta-Data
      [ ] Turn
    [ ] Configuration
      [ ] fog: boolean
      [ ] turnLimit: int
      [ ] turnTimeLimit: int
      [ ] gameTimeLimit: int

M5:
===

[ ] OAL elements
  [ ] Fog Data will be analyzed
  [ ] Unit Move
    - Shows a map of action targets with the possible actions in the OAL
    - Manipulates the fog data
  [ ] Capture Building
  [ ] Waiting
  [ ] Load Unit
  [ ] Unload Unit
  [ ] Supply Unit

M6:
===

[ ] OAL elements
  [ ] Attack
    - Indirects attacks over a wider range
    - Directs gets counter attacks
    - Indirects gets no counter attacks
    - Gives owners power as refund for damage
  [ ] Attack Range
  [ ] Unit Joining
    - Merges hp and gives refund to the owner

M7:
===

[ ] OAL elements
  [ ] Production
    - Lowers players money
    - Places an unit at a position
    - OAL returns a list like produce::INFT, produce::MECH... 
  [ ] Fire Rocket 
    - Requires an additional parameter for the position
    - Fires a rocket to the position and places damage to objects
  [ ] Self Destruction
    - Damages object in near area of the destruction
  
M8:
===

[ ] OAL elements
  - Transfers
    [ ] Transfer Money
    [ ] Transfer Unit
    [ ] Transfer Property
  - Powers
    [ ] Activate CO-Power
    [ ] Activate Super-CO-Power
    - Deactivates after one turn
  [ ] Yield Game

M9:
===

- Game Commanders
  - OS
    [ ] Andy
    [ ] Max
    [ ] Sami
  - BM
    [ ] Olaf
    [ ] Grit
  - YC
    [ ] Kanbei
    [ ] Sonja
    [ ] Sensei
  - GE
    [ ] Eagle 
  - BH
    [ ] Adder
    [ ] Lash
    [ ] Sturm 

M10:
====

[ ] Validate game data
[ ] Persistence 
  [ ] Save game instance
  [ ] Load game instance
  - Backends
    [ ] LocalForage

M11:
====

[ ] Audio 
  - Backends
    [ ] NullAudio
    [ ] WebAudio
[ ] Offline Mode
  [ ] Cache Files
  [ ] Cache Gamedata

M12:
====

[ ] Input 
  - Backends
    [ ] Keyboard
    [ ] Gamepad
    [ ] Touch
    [ ] Mouse

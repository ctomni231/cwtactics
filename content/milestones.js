PAGE_DATA.milestones = [
  
  /*
  {
    header: "Version",
    version: "0.3.4",
    subHeaderT: "UI, Cannons, AI",
    subHeaderB: "and Offline Mode",
        
    text:[
      ""
    ],
    
    img: "images/milestones/v0_3_4.png",
    
    changelog:[
      "New Maps, Stand-Off (1vs1) and Spann-Island (1vs1)",
    	"One-Step Action-Menu when an unit is out of fuel",
    	"New UI",
    	"Error Popup",
    	"Enhanced Rule-Engine",
    	"Offline Capability"
    ]
  },
  */
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Version",
    version: "0.3.1.2",
    subHeaderT: "CO's, Scripting",
    subHeaderB: "and Screens",
        
    text:[
      "The first version of CW:T that adds the screen mechanic to the mobile client. Furthermore this version adds new game mechanics like CO with day to day effects and basic scripting."
    ],
    
    img: "images/milestones/v0_3_1.png",
    
    changelog:[
      "------------------- v0.3.1.2 ----------------------",
      "Enhancement: versus Game and Options have a better visual feedback (I'm playable) than the disabled menu entries",
      "Enhancement: 2-finger tap works as cancel -> removed old cancel logic",
      "Enhancement: sami's music is now the original one",
      "Enhancement: better yielding system",
      "Fix: no music reset when you go back from the Options screen",
      "Fix: load error wasn't cleared after entering main due an error",
      "Fix: units do not replenish supplies on properties",
      "Fix: cannot select properties sometimes",
      "Fix: can attack allies",
      "Fix: can try to attack the position where unit being moved was",
      "Fix: message panel won’t close in some situations",
      "Fix: infantry can capture, but even after capture points are depleted, property is still owned by original owner",
      "Fix: capture flag symbol on infantry does not go away after attempted capture",
      "Fix: transfer money does not change the gold value displayed until next turn (day)",
      "Fix: own hq is transferable",
      "Fix: attacks do not do damage",
      "Fix: could transfer money to neutral properties",
      "Fix: when sitting on enemy property, it healed my unit on its turn",
      "Fix: unable to select the firing unit after firing silo",
      "Fix: unable to select my properties after firing silo",
      "Fix: infantry healed on airport and port",
      "Fix: when unloading unit, it only gives a number to identify the unit by",
      "Fix: unit experiencing trap, got to move again from new position",
      "Fix: low fuel, ammo, and capture animations disappear when unit is transferred",
      "Fix: you can move an green allied unit into a red APC unit using the transfer money command",
      "Fix: the transfer property options transfers a unit. The transfer unit command transfers a property",
      "Fix: units built are allowed to move directly after being built",
      "Fix: the menu displays some of the raw names like NTNK and TNTK on the build menu",
      "Fix: if you build a Neotank, it displayes the HP on the wrong spot and does not show that unit",
      "Fix: if you try to unload a unit and all the spaces are taken up after unloading the first one, it doesn't prevent you from unloading",
      "Fix: counterattacking damage when attacking a blue unit is not registered for non-infantry units that are red",
      "------------------- v0.3.1.1 ----------------------",
      "Fix: cannot build",
      "Fix: attack does nothing",
      "Fix: can attack own units",
      "------------------- v0.3.1 ----------------------",
      "Feature: soldiers get +3 vision on mountains",
      "Feature: AWDS default mod",
      "Feature: different terrain variants",
      "Feature: game data tag values",
      "Feature: round configuration values",
      "Feature: if a joined unit has more than 99 health then the difference will be payed to the owners gold depot",
      "Feature: CO mechanic (power gathering, names, music and day 2 day effects)",
      "Feature: terrain has a defense value that gives defense bonus",
      "Feature: units can counter attacks ( except indirect units )",
      "Feature: weather system",
      "Feature: simple rule engine",
      "Feature: fuel consumption at turn start",
      "Feature: auto supply by supply units at turn start",
      "Feature: background music",
      "Feature: mobile client caches music data",
      "Feature: mobile client caches image data",
      "Feature: map selection",
      "Feature: simplified target selection during the select action target state",
      "Feature: unit information screen",
      "Feature: tile information screen",
      "Feature: player information screen",
      "Feature: attack range information selection map",
      "Feature: information screens are access able with keyboard keys 1 to 4",
      "Feature: information screens are access able with mouse drag up,left,right and down",
      "Feature: information screens are access able with double finger swipe up,left,right and down",
      "Feature: drag/swipe based input system on mobile devices",
      "Feature: options screen to control volume and to wipe out cached data",
      "Enhancement: moved timer logic into engine",
      "Enhancement: rewritten input system",
      "Enhancement: added WebSQL and IndexedDB backend for storage API for the mobile client",
      "Enhancement: win by destroy all enemy units as config value",
      "Enhancement: silo cursor while firing rocket in mobile client",
      "Enhancement: better resuppling/repairing for allied objects",
      "Enhancement: better scrolling on iOS",
      "Enhancement: simpler weapon model",
      "Enhancement: showing gold and power on top of the game screen",
      "Enhancement: preventing text/element selection in the mobile client",
      "Enhancement: more zoom levels",
      "Enhancement: faster zoom speed",
      "Enhancement: if you click outside of the menu then the game invokes a cancel action",
      "Fix: fog bug after capturing player HQTR",
      "Fix: attack crashes the game sometimes",
      "Fix: transporters could be transfered to other players -> results in crash",
      "Fix: if you cross the move path then the path will be weird",
      "Fix: move path will be corrupted after invoking cancel in a sub menu",
      "Fix: unload unit in fog breaks the model",
      "Fix: units in fog was attackable",
      "Fix: various Internet Explorer fixes",
      "Fix: the damage calculation was wrong",
      "Fix: indirect units can move and fire in the same turn",
      "Fix: cannot win by capturing HQTR",
      "Fix: cannot win by destroying all enemy units",
      "Fix: ammo does not deplete",
      "Fix: joining does not work in some situations",
      "Fix: moving an unit into a tile that is occuppied by a hidden enemy unit crashes the game",
      "Fix: done was missing in multi step actions",
      "Fix: you can transer money to yourself",
      "Fix: rocket silo action breaks menu in some situations",
      "Fix: unloading units breaks the engine",
      "Fix: counter weapon was not found if target uses weapon without ammo while having no ammo"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.69",
    subHeaderT: "Hot Fix",
    subHeaderB: "",
    
    img: "images/milestones/milestone2_69.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.69/starter.html",
    
    text:[
      ""
    ],
    
    changelog:[
      "Fix: you cannot transfer units with loaded units",
      "Fix: the game crashes while searching a counter weapon",
      "Feature: attacking and defending gives power to the owners power depot",
      "Feature: you can hide and unhide units with the canHide ability",
      "Feature: re-enabled mouse wheel zooming",
      "Enhancement: on desktop a click outside of the menu invokes a cancel ( on touch devices an action )"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.68",
    subHeaderT: "Weather and",
    subHeaderB: "more Fixes",
    
    img: "images/milestones/milestone2_68.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.68/starter.html",
    
    text:[
      ""
    ],
    
    changelog:[
      "Feature: implemented weather (functional) with affects on vision and move costs",
      "Feature: game rule that enables/disables healing of units on properties",
      "Feature: game rule that enables/disables healing of units on allied properties",
      "Feature: game rule that enables/disables supplying of units on properties",
      "Feature: game rule that enables/disables supplying of units on allied properties",
      "Fix: auto refill resources by supply units rule is now enabled by default",
      "Fix: attacks with ammo using weapons decreases the units ammo depot",
      "Fix: damage was not scaled by HP lost",
      "Fix: move path won't be cleaned if you go back from a menu state",
      "Fix: terrain stars was not recognized in attack damage",
      "Fix: defensers do not counter attack if they survive the attack",
      "Fix: html elements are no longer in selection if you click hold and shift you cursor",
      "Enhancement: faster transition to zoom in/out and map shifting",
      "Enhancement: added additional zoom steps (0.8x and 0.7x)",
      "Enhancement: touch devices can control the menu index by dragging up and down",
      "Enhancement: the direction of map shift uses Apples idea if shift in iOS devices (e.g. slide up to move down)",
      "Enhancement: engine uses less for better CSS"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.65",
    subHeaderT: "Bugfixes",
    subHeaderB: "and more",
    
    img: "images/milestones/milestone2_65.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.65/starter.html",
    
    text:[
      ""
    ],
    
    changelog:[
      "Fix: you can spend money to yourself",
      "Fix: done action wasn't added to the menu during a muiltistep action",
      "Fix: trapping crashes the engine",
      "Fix: engine crash after capturing enemy hq",
      "Fix: no units left condition",
      "Fix: end turn action condition don't shown on own hq",
      "Fix: you can get information about objects that are in fog",
      "Fix: getElementsByTagName workaround for Internet Explorer 9",
      "Enhancement: joining strategy makes a correct hp point addition",
      "Enhancement: if a unit moves then it cannot attack with indirect weapons",
      "Enhancement: show send money action if you click on somebodies hq",
      "Enhancement: unit type names are shown in the unload menu instead of their identical numbers",
      "Enhancement: player names are shown in the give unit/property menu instead of their identical numbers",
      "Enhancement: silo regeneration in turns or days",
      "Enhancement: destroy animation on units if a player lost its hq",
      "Enhancement: silo cursor"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.61",
    subHeaderT: "Internet Explorer",
    subHeaderB: "Fix",
    
    img: "images/milestones/milestone2_61.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.61/starter.html",
    
    text:[
      "This first time ever in the complete history of Custom Wars Tactics... we are happy to announce the Internet Explorer 9 :D",
      "It is now able to render the screen and do the zooming feature. Due a bug the Internet Explorer cannot open the menu yet."
    ],
    
    changelog:[
      "IE 9 Canvas fix",
      "IE 9 CSS Transition fix"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.6",
    subHeaderT: "Last Alpha",
    subHeaderB: "Standing",
    
    img: "images/milestones/milestone2_6.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.6/starterDebug.html",
    
    text:[
      "This is the last release of the alpha phase. The next release will officially starting the beta phase of Custom Wars Tactics. Instead of the naming schema Milestone X we using a new versioning schema. The next release will be Custom Wars Tactics 0.3 Beta.",
      "This milestone is a refactoring milestone that has more internal enhancements." ,
      "Because the next branch (0.3x) adds the network features we worked a lot to decrease the memory footprint of the engine."
    ],
    
    changelog:[
      "Storage API",
      "Storage API: local storage will be used in the webClient",
      "Pluggable map save/load system ( backwards compability )",
      "Refactored map structure",
      "Smaller type names for smaller RAM consumption",
      "Refactored action structure for smaller network traffic and RAM consumption",
      "Cleaner selection values (source,target,selectionTarget) in the action process",
      "Added a dynamical menu rendering function in the webClient",
      "Updated engine documentation",
      "Mod data will be loaded dynamically",
      "The player limit will be 4 per game round",
      "The unit limit will be set to 50 units per fraction",
      "The property limit will be set to 200 per game round",
      "Slower move animation for 2.x series",
      "Moved turn ticker into engine",
      "Better update fog / status handling in the webclient",
      "Webclient uses SoundJs",
      "Added yellow and black color sheme",
      "Every fraction has a constant color",
      "Click/cancel sound",
      "Redesigned menu",
      "Tile information in the menu",
      "Enhanced menu entries",
      "Keyboard support in the menu",
      "Attack range will be shown if a cancel action will be holded",
      "Neutral properties will be rendered grey",
      "Animation: destroy animation",
      "Animation: silo rocket explosion animation",
      "Animation: dust behind the move path of an unit",
      "Action: a player can transfer his money to the gold depot of an other player",
      "Action: a player can transfer his units and properties to an other player",
      "Simple rule system",
      "Rule: silo regeneration",
      "Rule: fog mode",
      "Show loaded unit status"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.4",
    subHeaderT: "Fog of",
    subHeaderB: "War",
    
    img: "images/milestones/milestone2_4.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.4/starterDebug.html",
    
    text:[
      "It will include the fog of war system.",
      "This will be the last milestone with the old data system. Future versions of Cwt will be moddable only on source level. We want to make the game optimized to use only a little of RAM while giving a modding ability.",
      "Our last approach to make Cwt itself as general platform for own AW style game is dropped! This is because this target is not realizable under normal conditions and furthermore the most users want more usability than customization."
    ],
    
    changelog:[
      "Added fog mode",
      "Rule set object",
    ]
  },
     
  // --------------------------------------------------------------------------------------------------------
      
  {
    header: "Milestone",
    version: "2.2",
    subHeaderT: "Firefox",
    subHeaderB: "Fixes",
    
    img: "images/milestones/milestone2_2.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.2/starterDebug.html",
    
    text:[
      "Solved the mouse control issues in firefox, but there are some coloring issues."
    ],
    
    changelog:[
      "N/A"
    ]
  }, 
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2.1",
    subHeaderT: "Touch Input",
    subHeaderB: "Fixes",
    
    img: "images/milestones/milestone2_1.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.1/starterDebug.html",
    
    text:[
      "Solved some control issues and implemented a version tag in the upper left coner."
    ],
    
    changelog:[
      "N/A"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "2",
    subHeaderT: "Game",
    subHeaderB: "Rounds",
    
    img: "images/milestones/milestone2.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2/starterDebug.html",
    
    text:[
      "This will be the last HTML client only milestone. The HTML client and the java client will be released in a similar state of functionality with the next milestone releases.",
      "The second milestone is mostly a refactoring milestone because we fixed a lot of problems of the milestone 1. We did it to prepare the engine for next upcoming features. Beside of many under the hood updates, milestone 2 introduces some new features like information boxes, a complete game round, building units and so on.",
      "As one of first milestones, milestone 2 has a endable game round. If you conquer the enemy <strong>HQTR</strong>, the game will end. In this release you will get a message box which shows you the end of the game."
    ],
    
    changelog:[
      "N/A"
    ]
  },
  
  // --------------------------------------------------------------------------------------------------------
  
  {
    header: "Milestone",
    version: "1",
    subHeaderT: "We need",
    subHeaderB: "visual stuff",
    
    img: "images/milestones/milestone1.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m1/webClient.html",
    
    text:[
      "The first milestone tries to build the base for the web client and the java client. It provides a nearly complete model with first logic functionalities.",
      "<strong>Note,</strong> this is an alpha milestone and contains many bugs. Hopefully milestone 2 will be a lot better. xD"
    ],
    
    changelog:[
      "N/A"
    ]
  }
  
];
PAGE_DATA.latestMilestone = "gamedata/actual/webclient/0.3.1/startGame.html";

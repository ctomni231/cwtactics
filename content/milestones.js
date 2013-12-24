PAGE_DATA.milestones = [
  
  {
    header: "Version",
    version: "0.3.5",
    subHeaderT: "Buggy-Hopper",
    subHeaderB: "(AI,Cannons,UI,Animations)",

    text:[
      "Custom Wars: Tactics 0.3.5 is a special release for the end of the year 2013 and is primary a small preview in the upcoming features of the version 0.4.",
      "The main aspect of this release is a huge refactoring of the internal engine. This results in an event based design, that allows a better customization for engine developers. Furthermore we redesigned the complete look and feel to match with the new GUI styles of Android and iOS.",
      "Another feature is the offline mode. CW:T 0.3.5 uses the HTML5 offline application cache and WebSQL/IndexedDB to store all data in your browser.",
      "As special, this version contains a first alpha version of DumbBoy, the AI for CWT. In this version the AI is already able to do something, which allows to play, more or less, game rounds in the CW:T beta. <strong>Note:</strong> DumbBoy is alpha software and may not work 100% correctly with CW:T. It's a sneak preview for harcore players. :P",
      "At last, we added cannon logic to the version. Be sure to check them out on the development test map.",
      "At least we want to mention, that 0.3.5 is maybe buggy in some terms. This is because 0.3.5 isn't a primary planned release. At all, like said before, it is a preview of 0.4."
    ],

    img: "images/milestones/v0_3_5.png",

    log:{
      "NEW":[
        "Completely redesigned look and feel",
        "Added simple artificial intelligence: DumbBoy version 0.10",
        "2 new 2-players maps: Spann-Island and Stand-Off",
        "3 new 4-players maps: Minus-Hills, Shuriken-Valley and Outpost-Plus (incomplete)",
        "Offline mode",
        "Added some animated tiles (needs fast device)",
        "S-Bomb suicide unit",
        "Added river and bridges",
        "Added CO's: Andy, Max and Sami",
        "Cannons, Small-Cannons and Lasers (destructable)",
        "Player configuration screen",
        "Some game tips will be shown randomly in the start screen",
        "Language will be selected automatically",
        "Added a random background image selection",
        "<code>HTML5 Game-Pad</code> support on <code>Chrome</code> (experimental)",
        "The input buttons are configurable now",
        "Sounds are played when one unit attacks another unit",
        "Several new scripting attributes (including scripted Co-Powers)",
        "Rocket silo has now a rocket animation",
        "Some units drains fuel at turn start now",
        "Error Panel which indicates an error when the game breaks",
        "Added option to force touch controls on touch capable desktop systems"
      ],
      "CHANGED":[
        "Faster game startup due rewritten data-loader",
        "In-Game options entry leads directly into the options screen",
        "Redesigned option and map selection scren",
        "The fog system is now client based",
        "One-Step Action-Menu when an unit is out of fuel",
        "Hidden units aren't attackable when they're not visible",
        "Performance improvements in the animation system",
        "Simplyfied control system down to d-pad and two buttons",
        "Units can only transfered when they didn't moved",
        "Restructured modification files",
        "Special animation cycle for copters ",
        "Updated rule engine to the current version of <code>jsonRuleEngine</code>",
        "Changed game license to MPL 2"
      ],
      "FIXED":[
        "Fixed database faults on Firefox and Apple Safari",
        "Fixed bug that made hidden units unattackable",
        "Fixed Yellow-Comet color schema",
        "Fixed bug that didn't revealed hidden units after moving into a trap",
        "Fixed bug that results into a game break when yielding on a big map"
      ]
    }
  },
  

  // -------------------------------------------------------------------------------------------

  {
    header: "Version",
    version: "0.3.1.2",
    subHeaderT: "CO's, Scripting",
    subHeaderB: "and Screens",

    text:[
      "The first version of CW:T that adds the screen mechanic to the mobile client. Furthermore this version adds new game mechanics like CO with day to day effects and basic scripting."
    ],

    img: "images/milestones/v0_3_1.png",
    link: "http://battle.customwars.com/gamedata/actual/webclient/0.3.1/startGame.html",

    log:{
      "NEW":[
        "Soldiers get +3 vision on mountains",
        "Support for terrain variants",
        "Added Round configuration",
        "If joining goes beyond the hp limit then the difference will be returned as gold",
        "Added basic CO mechanics",
        "Supply units supplies neighbors at turn start",
        "Added Background music",
        "Mobile client caches music data",
        "Mobile client caches image data",
        "Unit information screen",
        "Tile information screen",
        "Player information screen",
        "Attack range information selection map",
        "Added map selection screen",
        "Gold and Power on top of the game screen",
        "Added options screen to control volume and to wipe out cached data"
      ],
      "CHANGED":[
        "Enhanced weather system",
        "Simplified target selection during the select action target state",
        "Moved timer logic into engine",
        "Rewritten input system",
        "Added WebSQL and IndexedDB backend for storage API",
        "Win by destroy all enemy units as config value",
        "Better resuppling/repairing for allied objects",
        "Better scrolling on iOS",
        "Simpler weapon model",
        "Preventing text/element selection in the mobile client",
        "Versus Game and Options have a better visual feedback",
        "2-finger tap works as cancel -> removed old cancel logic",
        "Sami's music is now the original one",
        "Better yielding system"
      ],
      "FIXED":[
        "Fog bug after capturing player HQTR",
        "Attack crashes the game sometimes",
        "If you cross the move path then the path will be weird",
        "Move path will be corrupted after invoking cancel in a sub menu",
        "Unload unit in fog breaks the model",
        "Could attack units in fog",
        "The damage calculation was wrong",
        "Indirect units can move and fire in the same turn",
        "Could not win by capturing HQTR",
        "Could not win by destroying all enemy units",
        "Ammo does not deplete",
        "Joining does not work in some situations",
        "Moving an unit into a tile with a hidden unit crashes",
        "Rocket silo action breaks menu in some situations",
        "Counter weapon could not found sometimes",
        "Could not build",
        "Attack does nothing",
        "Could attack own units",
        "No music reset when you go back from the Options screen",
        "Load error wasn't cleared after entering main due an error",
        "Units do not replenish supplies on properties",
        "Could not select properties sometimes",
        "Can attack allies",
        "Can try to attack the position where unit being moved was",
        "Message panel won’t close in some situations",
        "Infantry can capture, but property is still owned by original owner",
        "Capture flag symbol on infantry does not go away after attempted capture",
        "Transfer money does not change the gold value displayed until next turn (day)",
        "Own hq is transferable",
        "Attacks do not do damage",
        "Could transfer money to neutral properties",
        "When sitting on enemy property, it healed my unit on its turn",
        "Unable to select the firing unit after firing silo",
        "Unable to select my properties after firing silo",
        "Infantry healed on airport and port",
        "When unloading unit, it only gives a number to identify the unit by",
        "Unit experiencing trap, got to move again from new position",
        "Low fuel, ammo, and capture animations disappear when unit is transferred",
        "You could move an green allied unit into a red APC",
        "The transfer property options transfers a unit",
        "The transfer unit command transfers a property",
        "Units built are allowed to move directly after being built",
        "If you build a Neotank, it displayes the HP on the wrong spot",
        "You could try to unload a unit, even when all the target tiles are occuppied",
        "Counterattacking damage was not registered for non-infantry units"
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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

    log:{
      "NEW":[
        "Attacking and defending gives power to the owners power depot",
        "You can hide and unhide units with the canHide ability",
        "Enabled mouse wheel zooming"
      ],
      "CHANGED":[
        "On desktop a click outside of the menu invokes a cancel, on touch devices an action",
        "You cannot transfer units with loaded units now",
      ],
      "FIXED":[
        "Fixed the game crashes while searching a counter weapon"
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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


    log:{
      "NEW":[
        "Implemented weather (functional) with affects on vision and move costs",
        "Added game rule that enables/disables healing of units on properties",
        "Added game rule that enables/disables healing of units on allied properties",
        "Added game rule that enables/disables supplying of units on properties",
        "Added game rule that enables/disables supplying of units on allied properties",
      ],
      "CHANGED":[
        "Faster transition to zoom in/out and map shifting",
        "Added additional zoom steps (0.8x and 0.7x)",
        "Touch devices can control the menu index by dragging up and down",
        "The direction of map shift uses Apples idea if shift in iOS devices",
        "Attacks with ammo using weapons decreases the units ammo depot",
        "HTML elements are no longer in selection if you click hold and shift you cursor",
        "Auto-Refill resources by supply units rule is now enabled by default",
        "Engine uses LESS for better CSS"
      ],
      "FIXED":[
        "Fixed that damage was not scaled by HP lost",
        "Fixed that a move path won't be cleaned if you go back from a menu state",
        "Fixed that terrain stars was not recognized in attack damage",
        "Fixed that defensers could not counter attack if they survive the attack",
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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

    log:{
      "NEW":[
        "Added silo cursor",
        "Added destroy animation on units if a player lost its hq",
        "Added destroy animation on units if a player lost its hq"
      ],
      "CHANGED":[
        "Joining strategy makes a correct hp point addition",
        "If a unit moves then it cannot attack with indirect weapons",
        "Show send money action if you click on somebodies hq",
        "Unit type names instead of their identical numbers (menu)",
        "Player names instead of their identical numbers (menu)",
        "Silo regeneration in turns or days"
      ],
      "FIXED":[
        "Fixed that you could spend money to yourself",
        "Fixed that a done action wasn't added to the menu during a muiltistep action",
        "Fixed engine crash after a trap",
        "Fixed engine crash after capturing enemy hq",
        "Fixed the no units left condition",
        "Fixed that the endTurn action condition don't shown on own hq",
        "Fixed the possibility to get information about objects that are in fog",
        "Workaround for getElementsByTagName on Internet Explorer 9"
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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

    log:{
      "NEW":[],
      "CHANGED":[],
      "FIXED":[
        "IE 9 Canvas fix",
        "IE 9 CSS Transition fix"
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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


    log:{
      "NEW":[
        "Added storage API",
        "Pluggable map save/load system",
        "Added an action: A player can transfer his money to the gold depot of an other player",
        "Added an action: A player can transfer his units and properties to an other player",
        "Added destroy animation",
        "Added silo rocket explosion animation",
        "Added dust behind the move path of an unit",
        "Click/cancel sound",
        "Added yellow and black color sheme",
        "Webclient uses SoundJs",
        "Added a dynamical menu rendering function in the webClient",
        "Attack range will be shown if a cancel action will be holded",
        "Enhanced menu entries",
        "Added simple rule system",
        "Added Rule: silo regeneration",
        "Added Rule: fog mode",
        "Keyboard support in the menu",
        "Shows loaded unit status",
        "Simple rule system"
      ],
      "CHANGED":[
        "Smaller type names for smaller RAM consumption",
        "Every fraction has a constant color",
        "Neutral properties will be rendered grey",
        "Refactored action structure for smaller network traffic and RAM consumption",
        "Cleaner selection values (source,target,selectionTarget) in the action process",
        "Refactored map structure",
        "Better update fog / status handling in the webclient",
        "Tile information in the menu",
        "Slower move animation for 2.x series",
        "Mod data will be loaded dynamically",
        "Redesigned menu",
        "Moved turn ticker into engine",
        "The player limit will be 4 per game round",
        "The unit limit is set to 50 units per fraction",
        "The property limit is set to 200 per game round"
      ],
      "FIXED":[

      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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

    log:{
      "NEW":[
        "Added fog mode",
        "Added rule set object"
      ],
      "CHANGED":[],
      "FIXED":[]
    }
  },

  // -------------------------------------------------------------------------------------------

  {
    header: "Milestone",
    version: "2.2",
    subHeaderT: "Firefox",
    subHeaderB: "Fixes",

    img: "images/milestones/milestone2_2.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.2/starterDebug.html",

    text:[
      ""
    ],

    log:{
      "NEW":[],
      "CHANGED":[],
      "FIXED":[
        "Fixes mouse control issues in Mozilla Firefox",
        "Fixes recoloring issues"
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

  {
    header: "Milestone",
    version: "2.1",
    subHeaderT: "Touch Input",
    subHeaderB: "Fixes",

    img: "images/milestones/milestone2_1.png",
    link: "http://battle.customwars.com/cwpages/games/milestones/m2.1/starterDebug.html",

    text:[
      ""
    ],

    log:{
      "NEW":[
        "Version tag in the upper left corner (dev feature)"
      ],
      "CHANGED":[],
      "FIXED":[
        "Some control issues"
      ]
    }
  },

  // -------------------------------------------------------------------------------------------

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

    log:{
      "NEW":[],
      "CHANGED":[],
      "FIXED":[]
    }
  },

  // -------------------------------------------------------------------------------------------

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

    log:{
      "NEW":[],
      "CHANGED":[],
      "FIXED":[]
    }
  }

];

// Grabs the latest link
//
PAGE_DATA.latestMilestone = PAGE_DATA.milestones[0].link;

PAGE_DATA.milestones = [
  
  {
    header: "Milestone",
    version: "2.61",
    subHeaderT: "Internet Explorer",
    subHeaderB: "Fix",
    
    img: "images/milestones/m2.6.png",
    
    text:[
      "This first time ever in the complete history of Custom Wars Tactics... we are happy to announce the Internet Explorer 9 :D",
      "It is now able to render the screen and do the zooming feature. Due a bug the Internet Explorer cannot open the menu yet."
    ],
    
    link: "games/milestones/m2.61/starter.html",
    
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
    
    img: "images/milestones/m2.6.png",
    
    text:[
      "This is the last release of the alpha phase. The next release will officially starting the beta phase of Custom Wars Tactics. Instead of the naming schema Milestone X we using a new versioning schema. The next release will be Custom Wars Tactics 0.3 Beta.",
      "This milestone is a refactoring milestone that has more internal enhancements." ,
      "Because the next branch (0.3x) adds the network features we worked a lot to decrease the memory footprint of the engine."
    ],
    
    link: "games/milestones/m2.6/starterDebug.html",
    
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
    
    img: "images/milestones/m2.4_pic_1.png",
    
    text:[
      "It will include the fog of war system.",
      "This will be the last milestone with the old data system. Future versions of Cwt will be moddable only on source level. We want to make the game optimized to use only a little of RAM while giving a modding ability.",
      "Our last approach to make Cwt itself as general platform for own AW style game is dropped! This is because this target is not realizable under normal conditions and furthermore the most users want more usability than customization."
    ],
    
    link: "games/milestones/m2.4/starterDebug.html",
    
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
    
    img: "images/milestones/m2.2.png",
    
    text:[
      "Solved the mouse control issues in firefox, but there are some coloring issues."
    ],
    
    link: "games/milestones/m2.2/starterDebug.html",
    
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
    
    img: "images/milestones/m2.1.png",
    
    text:[
      "Solved some control issues and implemented a version tag in the upper left coner."
    ],
    
    link: "games/milestones/m2.6/starterDebug.html",
    
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
    
    img: "images/milestones/m2.png",
    
    text:[
      "This will be the last HTML client only milestone. The HTML client and the java client will be released in a similar state of functionality with the next milestone releases.",
      "The second milestone is mostly a refactoring milestone because we fixed a lot of problems of the milestone 1. We did it to prepare the engine for next upcoming features. Beside of many under the hood updates, milestone 2 introduces some new features like information boxes, a complete game round, building units and so on.",
      "As one of first milestones, milestone 2 has a endable game round. If you conquer the enemy <strong>HQTR</strong>, the game will end. In this release you will get a message box which shows you the end of the game."
    ],
    
    link: "games/milestones/m2/starterDebug.html",
    
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
    
    img: "images/milestones/m1.png",
    
    text:[
      "The first milestone tries to build the base for the web client and the java client. It provides a nearly complete model with first logic functionalities.",
      "<strong>Note,</strong> this is an alpha milestone and contains many bugs. Hopefully milestone 2 will be a lot better. xD"
    ],
    
    link: "games/milestones/m1/webClient.html",
    
    changelog:[
      "N/A"
    ]
  }
  
];

PAGE_DATA.latestMilestone = PAGE_DATA.milestones[0];
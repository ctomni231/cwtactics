var PAGE_MILESTONES = {
  milestones:[

    {
      header:"Milestone",
      version:"1",
      subHeaderT:"We need",
      subHeaderB:"visual stuff",
      pre:"The first milestone tries to build the base for the web client and the java client. It provides a nearly complete model with first logic functionalities.",
      link:"milestones/m1/webClient.html",
      linkCaption:"Play",
      post:"<strong>Note,</strong> this is an alpha milestone and contains many bugs. Hopefully milestone 2 will be a lot better. xD"
    },

    {
      header:"Milestone",
      version:"2",
      subHeaderT:"Game",
      subHeaderB:"Rounds",
      pre:"This will be the last HTML client only milestone. The HTML client and the java client will be released in a similar state of functionality with the next milestone releases.",
      link:"milestones/m2/starterDebug.html",
      linkCaption:"Play",
      img:"images/m2.png",
      post:"The second milestone is mostly a refactoring milestone because we fixed a lot of problems of the milestone 1. We did it to prepare the engine for next upcoming features. Beside of many under the hood updates, milestone 2 introduces some new features like information boxes, a complete game round, building units and so on. As one of first milestones, milestone 2 has a endable game round. If you conquer the enemy <strong>HQTR</strong>, the game will end. In this release you will get a message box which shows you the end of the game."
    },

    {
      header:"Milestone",
      version:"2.1",
      subHeaderT:"Touch Input",
      subHeaderB:"Fixes",
      pre:"",
      link:"milestones/m2.1/starterDebug.html",
      linkCaption:"Play",
      post:"Solved some control issues and implemented a version tag in the upper left coner."
    },

    {
      header:"Milestone",
      version:"2.2",
      subHeaderT:"Firefox",
      subHeaderB:"Fixes",
      pre:"",
      link:"milestones/m2.2/starterDebug.html",
      linkCaption:"Play",
      post:"Solved the mouse control issues in firefox, but there are some coloring issues."
    },

    {
      header:"Milestone",
      version:"2.4",
      subHeaderT:"Fog of",
      subHeaderB:"War",
      img:"images/m2.4_pic_1.png",
      pre:"It will include the fog of war system.",
      link:"milestones/m2.4/starterDebug.html",
      linkCaption:"Play",
      post:"This will be the last milestone with the old data system. Future versions of Cwt will be moddable only on source level. We want to make the game optimized to use only a little of RAM while giving a modding ability. </br></br>Our last approach to make Cwt itself as general platform for own AW style game is dropped! This is because this target is not realizable under normal conditions and furthermore the most users want more usability than customization."
    },
    
    {
      header:"Milestone",
      version:"2.6",
      subHeaderT:"Last Alpha",
      subHeaderB:"Standing",
      img:"images/m2.6.png",
      pre:"This is the last release of the alpha phase. The next release will officially starting the beta phase of Custom Wars Tactics. Instead of the naming schema Milestone X we using a new versioning schema. The next release will be Custom Wars Tactics 0.3 Beta. </br></br>This milestone is a refactoring milestone that has more internal enhancements. Because the next branch (0.3x) adds the network features we worked a lot to decrease the memory footprint of the engine.",
      post:"Changelog:<br><ul><li>storage API</li><li>storageAPI: local storage will be used in the webClient</li><li>pluggable map save/load system ( backwards compability )</li><li>refactored map structure</li><li>smaller type names for smaller RAM consumption</li><li>refactored action structure for smaller network traffic and RAM consumption</li><li>cleaner selection values (source,target,selectionTarget) in the action process</li><li>added a dynamical menu rendering function in the webClient</li><li>updated engine documentation</li><li>mod data will be loaded dynamically</li><li>the player limit will be 4 per game round</li><li>the unit limit will be set to 50 units per fraction</li><li>the property limit will be set to 200 per game round</li><li>slower move animation for 2.x series</li><li>moved turn ticker into engine</li><li>Better update fog / status handling in the webclient</li><li>webclient uses SoundJs</li><li>added yellow and black color sheme</li><li>every fraction has a constant color</li><li>click/cancel sound</li><li>redesigned menu</li><li>tile information in the menu</li><li>enhanced menu entries</li><li>keyboard support in the menu</li><li>attack range will be shown if a cancel action will be holded</li><li>neutral properties will be rendered grey</li><li>animation: destroy animation</li><li>animation: silo rocket explosion animation</li><li>animation: dust behind the move path of an unit</li><li>action: a player can transfer his money to the gold depot of an other player</li><li>action: a player can transfer  his units and properties to an other player</li><li>simple rule system</li><li>rule: silo regeneration</li><li>rule: fog mode</li><li>show loaded unit status</li></ul>",
      link:"milestones/m2.6/starterDebug.html",
      linkCaption:"Play",
    }/*,

    {
      header:"Milestone",
      version:"4",
      subHeaderT:"Artificial",
      subHeaderB:"Intelligence",
      pre:"",
      link:"",
      post:""
    },

    {
      header:"Milestone",
      version:"5",
      subHeaderT:"Being",
      subHeaderB:"Serious",
      pre:"",
      link:"",
      post:""
    },

    {
      header:"Version",
      version:"1.0",
      subHeaderT:"Initial",
      subHeaderB:"Release",
      pre:"",
      link:"",
      post:""
    } */
  ]
};
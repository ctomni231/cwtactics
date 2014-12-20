#### Custom Wars Tactics

**CW:T** is a rebuild of the original game series Advance Wars. The engine itself is a proof of concept to show the capabilities of HTML5 technologies. 

###### Requirements Desktop

* A 1 GHz CPU X-86
* 512 MB RAM
* Google Chrome 31
* At least 250MB free storage for the game data 

###### Requirements Android

* A 2x1.2GHz CPU 
* 512 MB RAM
* Mobile Chrome 31
* At least 50MB free storage for the game data

###### Requirements iOS

* An iOS 6 compatible device (while iOS7 recommended)
* 256 MB RAM
* At least 50MB free storage for the game data

#### How to build CW:T

The game files will be generated with the build system grunt. To download all dependencies manually you simply have to write **npm install** in your terminal while being in the root directory of the Custom Wars: Tactics repository. After that you can invoke the build process by typing the command **grunt** in your console.

    grunt <Command>

    Commands:

     docs   = Generates the documentation of CustomWars:Tactics
     report = Generates a mnarkdown file with all todo marks
     live   = Builds the game and it's dependencies in live mode (uglified)
     dev    = Builds the game and it's dependencies in debug mode
     
     default is dev

More information can be found on the Wiki Development page.
- [Game Deployment Wiki Page](https://github.com/ctomni231/cwtactics/wiki/Deployment-Documentation)

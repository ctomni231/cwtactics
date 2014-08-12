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

The game files will be build with the build system gulp. We stripped out all of gulps dependencies due a bug in *Microsoft Windows*. You have to extract *node_modules.rar* right after you checked out the. An alternative way is to download all dependencies manually. You can check them by looking into the build script file *gulpfile.js*. 

When the build system is prepared then you're able to invoke the build process by typing the command **gulp** in your console while being in the root directory of the CustomWars:Tactics repository.

    gulp Commands{0,N}

    Commands:

     clean = Cleans the build directory (will be used by live, dev automatically)
     docs  = Generates the documentation of CustomWars:Tactics
     todo  = Generates a mnarkdown file with all todo marks
     live  = Builds the game and it's dependencies in live mode (ulgyfied)
     dev   = Builds the game and it's dependencies in debug mode
     watch = Starts a server mode which invokes the 'dev' task automatically when a JavaScript file will be modified

     default is todo docs dev

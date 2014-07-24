Custom Wars Tactics **(CW:T)** is a rebuild of the original game series Advance Wars. The project itself contains 3
different pieces of software. The game engine, that holds the complete game with its logic, scripts and data. The
desktop client which is a graphical front end for the game engine written in Java and the mobile client, a
graphical frontend for CW:T completely written with web technologies.

#### Desktop Client

The desktop client is build on the JSlix library which is a part of the old cwt prototype. Because. JSlix is mainly 
maintained to support slower devices and providing some extra stuff for content designers like a full featured 
map editor.

###### Requirements

* Java Runtime Edition 6 or greater
* 1 GhZ CPU X-86
* 512 MB RAM

#### Mobile Client

The WebClient is designed as prototype to show the capabilities of HTML5 technologies. The main task is to provide the
complete game mechanic while providing basic multimedia support. The long term task is to create a basic mobile playable
more game mechanic oriented *(less fancy shiny)* client for the CW:T engine.

###### Requirements Android

* A 2x1.2GHz CPU 
* 512 MB RAM
* Mobile Chrome 30 and up

###### Requirements iOS

* iPad 1G, iPad-Mini, iPod Touch 4G or iPhone4
* iOS 6

#### How to build CW:T

The game files will be build with the build system gulp. Gulp plus all of it's dependencies is prepared in the
*node_modules* folder. All you need to start the build process is a nodeJs environment. You can invoke the process
with the command **gulp** in the root directory of the CustomWars:Tactics.

    gulp Commands{0,N}

    Commands:

     clean = Cleans the build directory (will be used by live, dev automatically)
     docs  = Generates the documentation of CustomWars:Tactics
     todo  = Generates a mnarkdown file with all todo marks
     live  = Builds the game and it's dependencies in live mode (ulgyfied)
     dev   = Builds the game and it's dependencies in debug mode
     watch = Starts a server mode which invokes the 'dev' task automatically when a JavaScript file will be modified

     default is todo docs dev
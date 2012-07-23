# Custom Wars Tactics #

**Custom Wars Tactics** (CWT) is a rebuild of the original game series Advance Wars. The project itself contains 3
different pieces of software. The game engine, that holds the complete game with its logic, scripts and so on. The
JSlix Client which is a graphical UI for the game engine written in Java and the WebClient. The WebClient is a
graphical frontend for CWT written with web technologies.

## Game Engine ##

### Custom Content ###

As you already saw, the name Custom Wars Tactics means that the game will be customizable in the end. The
customization process is a bit special because of the engine design. The important things you have to know
are covered in the following chapters.

#### Mod Editing ####

#### Map Editing ####

This is the most edited part in our opinion. The most users want to create, share and play their own custom maps
with their friends.

##### Structure of a map #####

Every map contains required data that must be available to make the map valid and additional data, that is not
required. The additional data are preset units, ownerships and so on. Furthermore scripts are another part of
the additional data.

Map editors allowed to write own scripts for their maps. These scripts are only active during the map is played and
will be removed from client after the game round is done. Unlike mod creators, map editors only allowed to react
on a subset of events.

## Game Clients ##

### Creating own clients ###

You can build your own game clients if you want. To make the best game experience available, you should follow some
rules during the creation of a game frontend.

An own game can written in every language you want. The only requirement is an API bridge to a javascript environment
where the game client can run in.

#### Graphics ####

Every game client needs to ship the graphic data on its own. As described in Mod Editing, the mod only ships the data
about objects and scripts, not the graphics. Because we don't know what kind of environment the game client runs in
(*which causes maybe incompabilities with graphic formats*) we decided to devide the graphics from the data. Normally
its pretty easy to implement graphics. The game engine always shares messages that follows a defined interface and
all game objects has a type string that indicates their type. You only need graphics for that types and actions.

This has some advantages. Modders don't have to add pictures for every kind of client. Another one is, the game client
can decide on its own how to render things. As example if the game client is powerful, then you can replace default
graphics by HQ graphics without modifing the modification. Text based clients ( maybe ) don't need graphics and that
would be bad to ship graphics with the mod, because the client do not need them. But at least we plan to give a
modification the ability to provide download parameters in the mod description to download some graphics for the mod.
A game client can download it if the needed data is not available.


### Clients build by the CWT team ###

This section shows the two official developed game clients by the cwt crew.

#### JSlix ####

JSlix is a part of the old cwt prototype and written in Java. Because of Java, the JSlix game client can run of all
devices that supports the Java Runtime Edition 6. JSlix is mainly maintained to support slower devices and providing
some extra enhancements, like a not fixed map storage.

##### Requirements #####

* Java Runtime Edition 6 or greater

#### WebClient ####

The WebClient is designed as prototype in HTML5 technologies. It is runnable on every up to date browser that supports
mostly the HTML5 capabilities. The target of the web client is to connect more peoples with open technologies.

##### Requirements #####

* A 2x1GHz CPU ( Apple A5 ) or 2x2Ghz desktop (**its the only tested CPU yet, we don't think you will need a fast cpu
  like that**)
* 512 MB RAM
* An actual web browser (iOS5, *Android 4.1 , Chrome 20, Firefox 10* [not fully tested])
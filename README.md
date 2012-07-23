# Custom Wars Tactics #

**Custom Wars Tactics** (CWT) is a rebuild of the original game series Advance Wars. The project itself contains 3 different pieces of software. The game engine, that holds the complete game with its logic, scripts and so on. The JSlix Client which is a graphical UI for the game engine written in Java and the WebClient. The WebClient is a graphical frontend for CWT written with web technologies.

## Game Engine ##

### Custom Content ###


## Game Clients ##

### Creating own clients ###

You can build your own game clients if you want. To make the best game experience available, you should follow some rules during the creation of a game frontend.  

An own game can written in every language you want. The only requirement is an API bridge to a javascript environment where the game client can run in.

### Clients build by the CWT team ###

This section shows the two official developed game clients by the cwt crew.

#### JSlix ####

JSlix is a part of the old cwt prototype and written in Java. Because of Java, the JSlix game client can run of all devices that supports the Java Runtime Edition 6. JSlix is mainly maintained to support slower devices and providing some extra enhancements, like a not fixed map storage.

##### Requirements #####

* Java Runtime Edition 6 or greater

#### WebClient ####

The WebClient is designed as prototype in HTML5 technologies. It is runnable on every up to date browser that supports mostly the HTML5 capabilities. The target of the web client is to connect more peoples with open technologies.

##### Requirements #####

* A 2x1GHz CPU ( Apple A5 ) or 2x2Ghz desktop (**its the only tested CPU yet, we don't think you will need a fast cpu like that**)
* 512 MB RAM
* An actual web browser (iOS5, *Android 4.1 , Chrome 20, Firefox 10* [not fully tested])
cwtactics - server api
======================

This small perl script will work in conjunction with CWTactics to save and restore data on a server. The interaction is RESTfull but the URL and response have not been fully defined yet. 

The data workflow is as basically as follows:

 * Request the creation of a game (create)
   * Provide a password
   * Recieve a unique ID for the game
 * The password is then shared with all the players
 * All players can then save date or read data (append/retrieve)
 * You can also keep the game date on the server or remove it (delete)
 
 The basic actions provided are based on four actions:
 * create - creates a game session
 * delete - eliminates a game session
 * append - appends an action to a game session
 * retrieve - get the list of actions for a game session

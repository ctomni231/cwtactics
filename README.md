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

Example
=======

All the requests are done via POST to http://hostname/cgi-bin/api.pl and all the variables are posted via form-data. The variables used are 'action, param, token and message'.
The 'action' variable is used to define the action, possible actions are {create, append, retrieve, delete}
The 'param' is used to send the uuid of the session you are trying to access.
The 'token' is used to pass a password. When you create a game you use this variable to define the password and later you can use to access the resources.
The 'message' variable is used to pass the data to be stored on the server.


 * Create a game by sending action=create and token=YOURPASSWORD. You will recieve the uuid of the session you just created.
 * To save data you need to send action=append, uuid=rANd0muUil, token=YOURPASSWORD, data=YOURDATA.
 * To retrieve data you send action=retrieve, uuid=rANd0muUil, token=YOURPASSWORD.
 * To delete a game the variables need to be action=delete, uuid=rANd0muUil, token=YOURPASSWORD.

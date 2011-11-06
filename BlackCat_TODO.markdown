Contains all remaining work orders for the custom wars tactics model, logic and in/out system.  
  
@author : Radom Alexander [BlackCat]  
@version : 06.11.2011  
  
  
**Legend :**  
[0] Not Started  
[1] Design   
[2] Implementing  
[3] Redesing ( e.g. due concept faults )  
[4] Bugfixing  
[5] Done  


##Custom Wars Tactics Beta-1

###Logic
* **[1]** menu 
* **[0]** turn
* **[2]** implement simple fog system (**fog.coffee**)

###Model
* **[2]** map
* **[2]** CO
* **[2]** model
* **[2]** player
* **[2]** database

###Neko Framework
* **[3]** neko core
* **[3]** error API, check API, persistent API (**core.coffee**)
* **[4]** i18N


##Custom Wars Tactics Beta-2

###Maps
* **[0]** campaign -> sp mission with persistent storage between missions
* **[0]** mission  -> mp/sp missions

###Logic
* **[0]** battle controller
* **[0]** moving controller
* **[1]** implementing deterministic path finding (**pathfinding.coffee**)

###Neko Framework
* **[0]** hooking API (**signals.coffee**)


##Custom Wars Tactics Final 1.0

###AI
* **[0]** implement first barebone with simple AI (**ai.coffee**)

###Logic
* **[0]** implement line fog system (**fog.coffee**)
* **[1]** implementing A* path finding (**pathfinding.coffee**)
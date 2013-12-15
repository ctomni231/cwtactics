/*

The engine is structured in the following manner. There are differen't folders that represents a different task. Between different folders ( called layers from now on ) exists rules accessing other folders.

**Layers:**

1. Core
2. Util
3. Model
4. Events
5. Persistence
6. SheetHandlers
7. Controller
8. Commands
9. Commands AI
10. Libs

![Engine Structure](/struct.png)

### 1. Core

The core contains the basic skeleton of Custom Wars: Tactics.

### 2. Util

### 3. Model

**Note:** The game client is allowed to access data of this module in a read only way. Furthermore all functions in this package are side effect free and can be called safely.

### 4. Events

This folder contains several event modules. Every file connects one or more handlers to
given events.


*/

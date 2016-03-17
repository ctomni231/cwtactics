# controller

The controller folder contains the frontend and interacts with the user.

# game

All stuff in this folder belongs to the game engine. The controller can access this engine only via the event bridge.

# core

Common stuff that is used by the game engine as well by the controller.

# test

Contains the game tests and will be included only when the game will be builded with ```-autotest```.

# events

Contains the event bridge and the handlers for each game part. 
YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [],
    "modules": [
        "controller",
        "model",
        "util"
    ],
    "allModules": [
        {
            "displayName": "controller",
            "name": "controller",
            "description": "This is the main access layer for the custom wars tactics game client. All\ndata changing actions will be invoked from this layer.\n\nThe layer itself is build as state machine which represents a player action.\nEvery action starts by a selection of a tile. Which the selected object will\nbe choosen by the state of the tile. An empty tile leads to a map action. An\nempty (owned) property leads to a property actions like buying an unit. The\nlast option will be choosen if the tile is occupied by an own unit."
        },
        {
            "displayName": "model",
            "name": "model",
            "description": "The model layer holds all necessary data for a game round. This layer can be\nextended to store additional data for game rounds.\n\nIf you extend this layer you should follow two rules. At first remember that\nevery property of this layer will be saved in a save game. The current\npersistence layer implementation uses a json algorithm to serialize all model\ndata. This means you cannot store cyclic data structures in the model layer.\nFurthermore you should not place functions in this layer because this would\nnot follow the specification of this layer."
        },
        {
            "displayName": "util",
            "name": "util",
            "description": "Some useful utility functions are stored in this layer. This layer contains\nthe logging functions of custom wars tactics. These functions are\noverwritable to have a custom log behaviour for the game client. As example\nif you use a graphical logging solution like BlackbirdJs."
        }
    ]
} };
});

# Model information events called for the client to change the GUI

NAME: map:tile:set
ARGS: x, y, type

NAME: state:entered:[STATENAME]
ARGS: []
DESC: Called when the model state changes
NOTE: This event maybe removed soon because the client will control the state model

# Model changing events 

Are callable from the user interactive stack in the model.

NAME: client:map:load
ARGS: [{}]
DESC: This events loads a map in the model
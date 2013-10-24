# Modules

Every file is a module and has a name. The name is also it's file name and the naming pattern for properties that can be placed in the global variables.

The file name itself defines by the pattern:

    #{moduleName}.js
    
The content of the file follows a simple order. 

1. Meta-data description (events,invokable commands,config variables...)
2. The module model properties
3. The module logic functions

Some modules may want to define persistence handler for the save/loading process and the for the data-sheet loaders. This stuff won't be added to the module file. Instead you create another module file with the same name in the foler `persistence`. This structure makes easy to find persistence stuff and decouples the model structure from the save game structure and data-sheet descriptions.

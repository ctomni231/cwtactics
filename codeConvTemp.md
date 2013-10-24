# Maximum Line Width

Every line has a maximum length of `100` characters.

## Indent function calls

If your function call would break the character limit of a single line, then you have to soft-wrap the call. We prefere to have every argument of the call in a single line then. Futhermore the arguments should have a greater indent as the name of the called function. Example:

    myCallOfAVeryLongFunction(
      myLongArgumentWhichContainsAVeryBadNamingSchema,
      myShortArgument,
      (checkSomeThing)? succValue: failValue,
      you,
      know,
      what,
      we,
      mean
    );

# Modules

Every file is a module and has a name. The name is also it's file name and the naming pattern for properties that can be placed in the global variables.

## Module-File

The file name itself defines by the pattern:

    #{moduleName}.js
    
## Module-Content
    
The content of the file follows a simple order. 

1. Meta-data description (events,invokable commands,config variables...)
2. The module model properties
3. The module logic functions

## Module-Properties and Module-Functions

The modules shares the same scope because they attached to one of the global variables of `CWT`. Because of this you have to use the name schema also on variable names to minimize the chance of naming collisions. Every property name will be constructed like this:

    #{moduleName}VariableName
    
Important is that the first letter of your variable name is written as capital letter, because we use a camel case schema for variable names as well.

## Persistence Handlers

Some modules may want to define persistence handler for the save/loading process and the for the data-sheet loaders. This stuff won't be added to the module file. Instead you create another module file with the same name in the foler `persistence`. This structure makes easy to find persistence stuff and decouples the model structure from the save game structure and data-sheet descriptions.

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

    #{moduleName}.js  :> fog.js
    
## Module-Content
    
The content of the file follows a simple order. 

1. Meta-data description (events,invokable commands,config variables...)
2. The module model properties
3. The module logic functions

## Module-Properties and Module-Functions

The modules shares the same scope because they attached to one of the global variables of `CWT`. Because of this you have to use the name schema also on variable names to minimize the chance of naming collisions. Every property name will be constructed like this:

    #{moduleName}_VariableName  :>  fog_map
    
Important is that the first letter of your variable name is written as capital letter, because we use a camel case schema for variable names as well.

## Module-Events

Module event names follows the same pattern as module properties. Example:

    #{moduleName}_Event  :>  fog_recalculated

## Private variables

*JavaScript* does not allow the declaration and usage of private variables. We like the *information hiding* pattern, but it's quite unusable for games in our opionion due drawbacks in terms of resource usage overhead. If you really need a property that can only used by your module, then you have two options. The first one is to define it as a public variable (which is the preferred one) with the following naming pattern.

    #{moduleName}_VariableName_

Another way to do this is to wrap the entire variable into a self executing function. This is pattern maybe more difficult to read sometimes. Atm we try to use it only when we need something like function constructing functions like in the following example. Pleas try to use the above pattern whenever it's possible. 

    (function(){
      
      function creaseMsgLogger( header ){
        return function( msg ){
          console.log( header+": "+msg );
        }
      }
      
      util.errorLog = createMsgLogger("ERROR");
      util.warnLog = createMsgLogger("WARN");
      util.log = createMsgLogger("FINE");
        
    })();

## Persistence Handlers

Some modules may want to define persistence handler for the save/loading process and the for the data-sheet loaders. This stuff won't be added to the module file. Instead you create another module file with the same name in the foler `persistence`. This structure makes easy to find persistence stuff and decouples the model structure from the save game structure and data-sheet descriptions.

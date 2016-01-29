Requirements
============

- node.js


Build game files
================

- Open `cmd` shell 
- Enter `root` or `src_builder` directly
- Call `node build.js -dev` or `node build.js -live` 

The result file will be generated in the `dist` directory.


Builder macros
==============

When the game is builded in `-dev` mode, then all `//#MACRO:IF DEV` macros will be removed. 

This means the source will be converted into result during the build process.

    Source:
    -------    
      console.log("available in every build mode");
      //#MACRO:IF DEV
      console.log("available only in dev build mode");
      //#MACRO:ENDIF
    
    
    Result in dev mode:
    -------------------    
      console.log("available in every build mode");
      //#MACRO:IF DEV
      console.log("available only in dev build mode");
      //#MACRO:ENDIF
      
      
    Result in live mode:
    --------------------    
      console.log("available in every build mode");
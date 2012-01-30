/**
 * This file contains all constants for CWT. This file can be used by th uglifyJS parser to inline the data of the
 * constants in all source files of the program. Furthermore uglifyJS can drop dead code like DEBUG. If you set 
 * DEBUG=false and pre-compile CWT with uglifyJS, all if( DEBUG )... checks will be removed. We use that technic for
 * producing fast distribution clients without manually need to remove the debug data.
 */

DEBUG = true;

MAX_PLAYER = 8;
MAX_UNITS = 50;
MAX_PROPERTIES = 0;
MAX_MAP_LENGTH = 50;
package com.client.tools;

import org.keplerproject.luajava.LuaException;
import org.keplerproject.luajava.LuaState;
import org.keplerproject.luajava.LuaStateFactory;

/**
 * Based off of Urusan's and my old class. This allows you to use Lua
 * functions within your coding language with ease.
 * @author Crecen
 */

public class LuaLibrary {
    private static LuaState lua;

    /**
     * Initializes the Lua functionality
     */
    public static LuaState getLua(){
        if(lua == null){
            lua = LuaStateFactory.newLuaState();
            lua.openLibs();
        }
        return lua;
    }

    /**
     * Associates Lua Engine with a specific Lua file of your choice
     */
    public static boolean runLuaFile(String filename){
        getLua();
        return (lua.LdoFile(filename) == 0);
    }

    /**
     * Allows lua to access LuaLoader execute() through lua function
     * string denoted by a name.
     * @param name The name of the function
     * @param function The function to associate the name with
     */
    public static void addFunction(String name, LuaLoader function){
        try{
            function.register(name);
        }catch(LuaException e){
            System.err.println("Failed to register '"+name+"' in Lua");
            System.err.println(e.toString());
        }
    }

    public static boolean runLuaString(String command){
        getLua();
        return (lua.LdoString(command) == 0);
    }

    /**
     * Executes a lua function
     */
    public static String executeLuaFunction(String command){
        return executeLuaFunction(command, new String[]{});
    }

    /**
     * Executes a lua function
     */
    public static String executeLuaFunction(String command, String[] args){
        lua.getGlobal(command);
        for(String com: args)  lua.pushString(com);
        lua.call(args.length,1);
        return lua.toString(-1);
    }

    /**
     * Get a variable from Lua
     */
    public static String getGlobalString(String name){
        lua.getGlobal(name);
        name = lua.toString(-1);
        lua.pop(1);
        return name;
    }
}

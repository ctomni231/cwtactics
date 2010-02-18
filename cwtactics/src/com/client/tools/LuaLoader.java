package com.client.tools;

import org.keplerproject.luajava.JavaFunction;
import org.keplerproject.luajava.LuaException;
import org.keplerproject.luajava.LuaState;

/**
 * Based off of Urusan's and my old class. This allows you to use Lua
 * functions within your coding language with ease.
 * @author Crecen
 */
public abstract class LuaLoader extends JavaFunction{
    private LuaState lua;

    public LuaLoader(){
        super(LuaLibrary.getLua());
        lua = LuaLibrary.getLua();
    }

    @Override
    public int execute() throws LuaException {
        setCommand(lua.toString(lua.getTop()));
        return 0;
    }

    /**
     * This is a function call helper to execute() Anything in here
     * can be accessed by a lua command specified by a name
     * @param name
     */
    public abstract void setCommand(String name);

    /**
     * Adds this function to the Lua Library
     */
    public void addLuaFunction(String name){
        LuaLibrary.addFunction(name, this);
    }
}

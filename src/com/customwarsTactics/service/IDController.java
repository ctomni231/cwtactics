package com.customwarsTactics.service;

import com.client.model.object.Map;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.error.NotImplementedError;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class IDController
{

    // singleton instance
    private static final IDController INSTANCE = new IDController();

    public Tile getTile( String ID , Map map )
    {
        //TODO
        throw new NotImplementedError();
    }

    public Unit getUnit( String ID , Map map )
    {
        //TODO
        throw new NotImplementedError();
    }

    public Player getPlayer( String ID , Map map )
    {
        //TODO
        throw new NotImplementedError();
    }


    public String getUnitID( Unit unit , Map map )
    {
        //TODO
        throw new NotImplementedError();
    }

    public String getTileID( Tile tile , Map map )
    {
        //TODO
        throw new NotImplementedError();
    }

    public String getPlayerID( Player player , Map map )
    {
        //TODO
        throw new NotImplementedError();
    }

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static IDController getInstance()
    {
        return IDController.INSTANCE;
    }

 }

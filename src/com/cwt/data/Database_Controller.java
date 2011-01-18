package com.cwt.data;

import com.cwt.data.typeSheets.ArmorClass;
import com.cwt.data.typeSheets.TileType_Sheet;
import com.cwt.data.typeSheets.UnitType_Sheet;
import com.cwt.data.typeSheets.WeaponType_Sheet;
//import com.system.data.sheets.Weather_Sheet;
import java.util.HashMap;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.12.2010
 * @todo TODO Class broken due to com.system & com.client removal
 */
public class Database_Controller
{

    // singleton instance
    private static final Database_Controller INSTANCE = new Database_Controller();
    
    //private HashMap<String, Weather_Sheet> weather_DB;
    private HashMap<String, UnitType_Sheet> unit_DB;
    private HashMap<String, TileType_Sheet> tile_DB;
    private HashMap<String, WeaponType_Sheet> weapon_DB;
    private HashMap<String, ArmorClass> armor_DB;
    private HashMap<String, Integer> tagDatabase;

    private Database_Controller()
    {
        weapon_DB = new HashMap<String, WeaponType_Sheet>();
        unit_DB = new HashMap<String, UnitType_Sheet>();
        tile_DB = new HashMap<String, TileType_Sheet>();
        weapon_DB = new HashMap<String, WeaponType_Sheet>();
        armor_DB = new HashMap<String, ArmorClass>();

        tagDatabase = new HashMap<String, Integer>();

        // pre-init data
    }

    /**
     * Returns the singleton instance of the singleton class.
     */
    public static Database_Controller getInstance()
    {
        return Database_Controller.INSTANCE;
    }

    /**
     * Class description.
     *
     * @author Radom, Alexander [ blackcat.myako@gmail.com ]
     * @license Look into "LICENSE" file for further information
     * @version 28.12.2010
     */
    private abstract static class TagsInit
    {
        private static void init( HashMap<String,Integer> tags )
        {

        }
    }
}

@Typed
package cwt.utilies

import cwt.model.Unit;
import cwt.model.map.Tile;
import cwt.model.map.Map;

/**
 * Utily methods for maps.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>Add unit controlling methods</LI>
 *       <LI>Optimize data types</LI>
 *       <LI>Add more range methods</LI>
 *       </UL>
 */
class MapUtils
{
	/**
	* Checks if a tile is occupied by an unit.
	*
	* @param self map object
	* @param tile tile object
	*/
   static boolean hasUnit( Map self , Tile tile )
   {
	   assert self
	   assert tile
	   assert self.unitMap
	   
	   return self.unitMap.containsKey( tile.identicalPos )
   }
   
   /**
	* Returns the unit object, that occupies the tile.
	*
	* @param self map object
	* @param tile tile object
	* @throws AssertionError if no unit occupies the tile
	*/
   static Unit getUnit( Map self , Tile tile )
   {
	   assert self
	   assert tile
	   assert hasUnit( self , tile)
	   
	   return self.unitMap.get( tile.identicalPos )
   }
   
   /**
	* Returns the x coordinate of a map.
	*
	* @param self map object
	* @param tile tile object
	*/
   static int getXPosition( Map self , Tile tile )
   {
	   assert self
	   assert tile
	   
	   // the rest is the x coordinate on the map
	   return tile.identicalPos%self.getWidth()
   }
   
   /**
	* Returns the y coordinate of a map.
	*
	* @param self map object
	* @param tile tile object
	*/
   static int getYPosition( Map self , Tile tile )
   {
	   assert self
	   assert tile
	   
	   // the clear division returns the y coordinate on the map
	   return tile.identicalPos/self.getWidth()
   }
   
   /**
	* Returns the distance of two different tiles.
	*
	* @param self map object
	* @param a tile a
	* @param b tile b
	*/
   static int getDistance( Map self , Tile a , Tile b )
   {
	   assert self
	   assert a && b
	   
	   return a==b ? 0 : ( Math.abs( getXPosition(self,a)-getXPosition(self,b) ) + Math.abs( getYPosition(self,a)-getYPosition(self,b) ) )
   }

   /**
	* Checks the number of alive teams.
	*/
   static boolean gameEnded( Map map )
   {
	   assert map
	   
	   def fd = false
		
	   map.teams.each{ 
			
			// if you find two alive teams, return true
			if( it.hasMembers() )
			{
				if( fd ) 
					return true
				else 
					fd = true
			}
	   }
		
	   return false
   }
}

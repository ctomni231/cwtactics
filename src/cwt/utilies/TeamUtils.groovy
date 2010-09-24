@Typed
package cwt.utilies

import cwt.model.Player;

class TeamUtils
{
	static boolean areAllied( Player p1 , Player p2 )
	{
		assert p1
		assert p2 
		
		return p1.team == p2.team
	}
	
	static boolean areEnemies( Player p1 , Player p2 )
	{
		assert p1
		assert p2
		
		return !areAllied(p1, p2)
	}
}

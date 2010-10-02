@Typed
package cwt_repo_tapsi.utilies

import cwt_repo_tapsi.model.map.Player;

/**
 * Team utily class.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class TeamUtils
{
	static boolean areAllied( Player self , Player player )
	{
		assert self
		assert player 
		
		return self.team == player.team
	}
	
	static boolean areEnemies( Player self , Player player )
	{
		assert self
		assert player
		
		return !areAllied(self, player)
	}
}

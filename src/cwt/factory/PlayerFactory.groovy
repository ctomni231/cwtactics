@Typed
package cwt.factory

import cwt.model.Player;
import cwt.model.Team;

/**
 * Player factory class.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 25.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class PlayerFactory
{
	
	/**
	 * Creates a single player instance and registers it in the team instance.
	 * 
	 * @param team team of the player
	 */
	Player createPlayer( Team team )
	{
		assert team 
		
		team.addMember()
		return new Player( team )
	}
	
	/**
	 * Removes a single player from the game and removes it also from the team
	 * instance.
	 * 
	 * @param player player instance.
	 */
	void destroyPlayer( Player player )
	{
		assert player
		assert player.team
		
		player.team.removeMember()
	}
}

@Typed
package cwt_repo_tapsi.model

import cwt_repo_tapsi.utilies.TeamUtils;

/**
 * Team instance that saves the amount of members of itself.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 1
 * @changelog <UL>
 *            <LI>v1
 *            <UL>
 *            <LI>initial version</LI>
 *            </UL>
 *            </LI>
 *            </UL>
 */
@Mixin( TeamUtils )
class Team
{
	byte members
	
	Team()
	{
		members = 0
	}
	
	@Override 
	protected void setMembers( byte members )
	{
		assert members >= 0

		this.members = members
	}
	
	/**
	 * Adds a member to the team.
	 */
	void addMember()
	{
		members++
	}
	
	/**
	 * Removes a member from the team.
	 */
	void removeMember()
	{
		assert members > 0
		
		members--
	}
	
	/**
	 * Has this team members?
	 */
	boolean hasMembers()
	{
		return ( members > 0 )? true : false 
	}
}

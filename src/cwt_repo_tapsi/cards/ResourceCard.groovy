@Typed
package cwt_repo_tapsi.cards

/**
 * Resource card class.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 01.10.2010
 */
class ResourceCard
{
	int[] resources
	
	ResourceCard()
	{
		// TODO get value from data
		setResources( new int[2] )
	}
	
	@Override
	void setResources( int[] resources )
	{
		this.resources = resources
	}
}

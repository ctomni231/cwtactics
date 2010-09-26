@Typed
package cwt_repo_tapsi.model.menu

/**
 * A special sub menu class, it is designed to
 * be expandable at runtime.
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
class ExpandAbleSubMenu extends SubMenu
{

	ExpandAbleSubMenu()
	{
		entries = []
	}
		
	/**
	 * Adds an entry to the child entries.
	 */
	void addEntry( MenuEntry entry )
	{
		assert entry != null
		assert !(entry in entries)
		
		entries + entry
	}
	
	/**
	 * Removes a child entry.
	 */
	void removeEntry( MenuEntry entry )
	{
		assert entry != null
		assert entry in entries
		
		entries - entry
	}
	
	/**
	 * Clears all child entries from entry.
	 */
	void clearMenu()
	{
		entries.clear()
	}
	
}

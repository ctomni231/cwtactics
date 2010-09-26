@Typed
package cwt_repo_tapsi.model.menu

import javax.swing.AbstractAction;

/**
 * Entry for a menu, but this entry is a submenu button and
 * contains child entries.
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
abstract class SubMenu extends MenuEntry
{
	
	protected List<MenuEntry> entries
	
	SubMenu( List<MenuEntry> list )
	{
		entries = list
	}
	
	/**
	 * Returns the number of child entries.
	 */
	int getSize()
	{
		return entries.size()
	}
	
	/**
	 * Returns the child entries of this sub menu entry
	 * as a list.
	 */
	List getEntries()
	{
		return entries
	}
	
	/**
	 * Has this sub menu a given entry in it's
	 * child entries ? 
	 * 
	 * @param entry entry instance
	 * @return true if contains it, else false
	 */
	boolean hasEntry( MenuEntry entry )
	{
		assert entry
		
		// true if entry is in entries or in a sub menu entry in entries
		return 
			entries.any{  
				it == entry || ( it instanceof SubMenu && ((SubMenu) it).hasEntry(entry) )  
			} 
	}
}

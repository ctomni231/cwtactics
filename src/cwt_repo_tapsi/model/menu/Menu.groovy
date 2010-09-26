@Typed
package cwt_repo_tapsi.model.menu

/**
 * Menu class, designed to work in a tree like behavior.
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
class Menu extends SubMenu
{

	MenuEntry selected
	private SubMenu root
	
	Menu( SubMenu menu )
	{
		assert menu && menu.getSize() > 0
		
		root = menu
	}	
	
	/**
	 * Returns root node of the menu.
	 */
	SubMenu getRoot()
	{
		return root
	}
	
	/**
	 * Sets the selected menu entry.
	 */
	void setSelected( MenuEntry entry )
	{
		assert entry && root.hasEntry(entry)
		
		selected = entry
	}
	
	/**
	 * Is an entry an instance of a sub menu entry?
	 * 
	 * @param entry entry instance
	 */
	static boolean isSubMenu( MenuEntry entry )
	{
		assert entry
		
		return entry instanceof SubMenu	
	}
		
	/**
	 * Returns a list of child entries of a given entry.
	 * 
	 * @param entry entry instance
	 * @return a list of entries if the entry is a sub menu, else null
	 */
	static List getEntriesOf( MenuEntry entry )
	{
		assert entry
		
		return ( entry instanceof SubMenu )? 
			( ((SubMenu) entry).getEntries() ) : null
	}
}

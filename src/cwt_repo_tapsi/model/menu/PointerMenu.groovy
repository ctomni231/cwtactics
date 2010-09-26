@Typed
package cwt_repo_tapsi.model.menu

/**
 * A pointer menu class, designed to realize a
 * single depth menu, that provides a multilevel 
 * data structure in the background.
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
class PointerMenu
{

	         int selectedIndex
	private Menu menuData
	     SubMenu selectedMenu
	
	PointerMenu( Menu menu )
	{
		menuData = menu
	}
	
	/**
	 * Sets the active sub menu.
	 * 
	 * @param menu sub menu instance
	 */
	void setSelectedMenu( SubMenu menu )
	{
		assert menu
		assert menuData.getRoot() == menu || menuData.getRoot().hasEntry(menu)
		
		selectedMenu = menu
		selectedIndex = 0	
	}
	
	/**
	 * Sets the selected index.
	 * 
	 * @param selectedIndex index number, must be in the range from 0 to the last index of the active sub menu
	 */
	void setSelectedIndex( int selectedIndex )
	{
		assert selectedIndex in 0..<selectedMenu.getSize()
		
		this.selectedIndex = selectedIndex
	}
	
	/**
	 * Increases the selected index.
	 */
	void increaseIndex()
	{
		if( selectedIndex < selectedMenu.getSize()-1 )
			selectedIndex++
	}
	
	/**
	 * Decreases the selected index.
	 */
	void decreaseIndex()
	{
		if( selectedIndex > 0 )
			selectedIndex--
	}
	
}

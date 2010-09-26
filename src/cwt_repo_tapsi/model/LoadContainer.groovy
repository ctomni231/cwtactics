@Typed
package cwt_repo_tapsi.model

/**
 * Load container to hold a number of units.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>add weight check ups</LI>
 *       <LI>write groovy doc</LI>
 *       </UL>
 */
class LoadContainer
{
	List<Unit> loaded
	
	@Override
	protected void setLoaded( List<Unit> loaded )
	{
		assert loaded
		
		this.loaded = loaded
	}
	
	void load( Unit unit )
	{
		assert loaded
		assert unit
		assert !loaded.contains(unit)
		
		loaded + unit
	}
	
	void unload( Unit unit )
	{
		assert loaded
		assert unit
		assert loaded.contains(unit)
		
		loaded.remove unit
	}
	
	short getWeight()
	{
		def n = 0
		
		loaded.each { n += it.type.weight }
		
		return n
	}
}

@Typed
package cwt_repo_tapsi.service.languageSupport

import java.util.ResourceBundle;

/**
 * Dictionary class that loads localized strings from a file.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class DictionaryService
{

	private ResourceBundle lang;
		
	DictionaryService( String fileName )
	{
		lang = ResourceBundle.getBundle( fileName , java.util.Locale.getDefault()  )
	}
	
	/**
	 * Returns a localized string for a given id.
	 *
	 * @param ID the id
	 * @return a localized string
	 */
	String get( String ID )
	{
		assert lang != null
		assert ID != null
		
		return lang.getString(ID) ?: "N/A" 
	}
}

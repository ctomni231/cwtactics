@Typed
package cwt_repo_tapsi.data

import java.io.File;

import groovy.util.XmlParser;

class TypeFactory
{
	
	static void loadMod( File directory )
	{
		//TODO not implemented yet
	}
	
	static void readUnitFile( File file )
	{
		assert file
		
		def xml = new XmlParser().parse(file)
		
		//TODO not complete yet
			
	}
	
	static void main( String[] args )
	{
		readUnitFile(new File("Units.xml"))
	}
}

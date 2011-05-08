package com.yasl.exception;

/**
 * Assertment exception class, is throw able at runtime, so it muss not be
 * check with try catch. It is designed, to be used by assertment methods like 
 * yasl Assert service class.
 *
 * @author Tapsi [blackcat.myako@gmail.com]
 * @version 26.03.2011
 */
public class AssertFailed extends RuntimeException
{

	public AssertFailed( String... messages )
	{
        super( generateMessage(messages) );
	}

	private static String generateMessage( String... messages )
	{
		if( messages == null ) return "";
		
		int e = messages.length;
		if( e == 0 )
			throw new IllegalArgumentException();
		
		StringBuilder b = new StringBuilder( messages[0] );
		for( int i = 0 ; i < e ; i++ )
		{
			b.append( messages[ i ] );
			if( i < e-1 ) 
				b.append(" ");
		}

        return b.toString();
	}
}

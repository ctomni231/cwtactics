package com.meowShell.parser;

import com.meowShell.parser.statements.ContextBlock;
import com.meowShell.parser.statements.Statement;
import com.meowShell.parser.statements.StatementBlock;
import com.meowShell.compiler.MeoWShellCompiler;
import com.meowShell.context.CallAbleBlock;
import com.meowShell.exception.SyntaxException;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.Properties;
import static com.yasl.assertions.Assertions.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * MeoWShell parser class, service provider to parse files and string lists.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class MeoWShellParser
{

    // singleton instance
    private static final MeoWShellParser INSTANCE = new MeoWShellParser();

    private MeoWShellParser() {}

    private ContextBlock readFile( File file )
    {
        assertNotNull(file);
        BufferedReader in = null;
        try
        {
            
            in = new BufferedReader(new FileReader(file));
            LinkedList<String> rows = new LinkedList<String>();
            String nextLine;

            while (true)
            {
                nextLine = in.readLine();

                if (nextLine == null) break;
                else rows.add(nextLine);
            }

            return parseStrings(rows);
        } 
        catch (IOException ex)
        {
            Logger.getLogger(MeoWShellParser.class.getName()).log(Level.SEVERE, null, ex);
        }
        finally
        {
            try
            {
                in.close();
            }
            catch (IOException ex) {
                Logger.getLogger(MeoWShellParser.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        throw new RuntimeException("file parsing failed");
    }

    /**
     * Parses a list of strings to a context block.
     *
     * @param rows list of strings
     * @return context block instance
     */
    private ContextBlock parseStrings( LinkedList<String> rows )
    {
        assertNotNull( rows );
        assertGreater( rows.size() , 0 );

        ContextBlock code = new ContextBlock();
        LinkedList<StatementBlock> blocks = new LinkedList<StatementBlock>();
        blocks.add(code);
        StatementBlock lastBlock = code;
        
        int i;
        int e = rows.size();
        Statement result;
        for( i = 0 ; i < e ; i++ )
        {

            result = getStatementFromString( rows.get(i) );

            // empty lines must be skipped
            if( result == null ) continue;

            // if the indention moves left, the active block must be setted
            while( result.getIndent() <= lastBlock.getIndent() )
            {
                if( blocks.size() == 1 )
                {
                    throw new SyntaxException("indent fault detected at : "+
                                               result.getStatement());
                }
                else
                {
                    blocks.removeLast();
                    lastBlock = blocks.peek();
                }
            }

            lastBlock.pushAtTail(result);

            // a block statement must be registered as active block
            if( result instanceof StatementBlock )
            {
                blocks.add( (StatementBlock) result );
                lastBlock = (StatementBlock) result;
            }
        }

        return code;
    }

    /**
	 * Parses the statement from a string and checks all information about
     * it ( indent , blanks, comments ).
	 */
	private Statement getStatementFromString( String str )
    {

        int[] indent = indentationOfStatement(str);

        int lastSign = indexOfComment(str);
        if( lastSign == -1 ) lastSign = str.length();

        // it's a comment or empty line
        if( indent[0] == lastSign )
            return null;

        str = str.substring( indent[0], lastSign ).replaceAll(" ","");

        if( str.contains(":") ) 
            return new StatementBlock( str , indent[1]);
        else 
            return new Statement( str , indent[1]);
	}

    /**
     * Checks the index of a comment in a statement.
     *
     * @param str statement string
     * @return the index of the comment character or -1 if no comment is in
     *         the statement
     */
    private int indexOfComment( String str )
    {
        int i;
        int e = str.length();
        boolean inString = false;
        char ch;

        for( i = 0 ; i < e ; i++ )
        {
            ch = str.charAt(i);

            if( !inString )
            {
                     if( ch == '#' ) return i;
                else if( ch == '"' ) inString = true;
            }
            else
                     if( ch == '"' ) inString = false;

        }
        
        return -1;
    }

    /**
	 * Checks the distance from the left border and remembers the index
     * of the first char of a statement.
     *
     * @param str statement string
     * @return integer array with this
     *         shape [ index of first char , distance from left border ]
	 */
	private int[] indentationOfStatement( String str )
    {
        char ch;
        int i;
        int l = 0;
        int e = str.length();
        boolean stop = false;

		for( i = 0 ; !stop && i < e ; i++ )
        {
            ch = str.charAt(i);
			switch(ch)
            {
                case ' '  :
                    l++;
                    break;

                case '\t' :
                    l+=4;
                    break;
                    
                default :
                    stop = true;
            }
		}

		return new int[]{ i-1 , l };
	}

    /**
     * Returns the singleton instance of the singleton class.
     * @return parser instance
     */
    public static MeoWShellParser getInstance()
    {
        return MeoWShellParser.INSTANCE;
    }

    public static void main( String[] args )
    {
        LinkedList<String> code = new LinkedList<String>();
        code.add("n = 0");
        code.add("while n >= 0 && n < 1000 : n++");
        
        ContextBlock bl = getInstance().parseStrings(code);

        Properties p = new Properties();
        MeoWShellCompiler.setTraceOn(p);
        CallAbleBlock func = MeoWShellCompiler.getInstance().compileBlock( p , bl);

        //for (int i = 0; i < 10; i++)
        //{
            //long time = System.nanoTime();
            func.call();
           // System.out.println("MeoWShell 2.0 : " + (System.nanoTime()-time)/1000000d + "ms");
        //}
     }

 }

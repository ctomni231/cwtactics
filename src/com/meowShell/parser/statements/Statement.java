package com.meowShell.parser.statements;

import static com.yasl.assertions.Assertions.*;

/**
 * Single source code statement.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class Statement
{
    private String statement;
    private int indent;

    public Statement( String statement , int indent )
    {
        assertNotNull(statement);
        assertGreaterEquals(indent, -1);
        
        this.statement = statement;
        this.indent = indent;
    }

    /**
     * @return the statement string
     */
    public String getStatement()
    {
        return statement;
    }

    /**
     * @return the indentation of the statement
     */
    public int getIndent()
    {
        return indent;
    }
}

package com.meowShell.parser.nodes;

import com.meowShell.parser.statements.Statement;
import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import com.meowShell.parser.nodes.Decreament;
import com.meowShell.parser.nodes.Increament;
import com.meowShell.parser.nodes.Node;
import com.meowShell.parser.nodes.Number;
import com.meowShell.parser.nodes.OperationNumber;
import com.meowShell.parser.nodes.OperationVariable;
import com.meowShell.parser.nodes.SetVariable;
import com.meowShell.parser.nodes.While;
import com.meowShell.parser.nodes.Variable;

/**
 * Node dictionary service contains all possible syntax nodes and provides
 * the many parsing services for statement objects.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class NodeDictionary
{
    // singleton instance
    private static final NodeDictionary INSTANCE = new NodeDictionary();

    // syntax nodes
    private Node setVariable = new SetVariable();
    private Node number = new Number();
    private Node variable = new Variable();
    private Node whileS = new While();
    private Node increament = new Increament();
    private Node decreament = new Decreament();
    private Node operationNumber = new OperationNumber();
    private Node operationVar = new OperationVariable();
    private Node arithmeticOp = new ArithmeticOperatior();
    private Node copy = new Copy();
    private Node condition = new Condition();
    private Node function = new Function();
    

    /**
     * Parses a statement, that should return an meow object after execution.
     *
     * @param properties properties object where the compiler flags are saved
     * @param context context builder instance where the pre compiles java
     *                source is putted in
     * @param statement the statement that will be parsed
     */
    public void parseReturnerStatement( IndentMarkerHolder marker , String statement )
    {
             if( number.fits(statement) )
                 number.parse( marker , statement);
        else if( copy.fits(statement))
                 copy.parse( marker , statement);
        else if( variable.fits(statement))
                 variable.parse( marker , statement);
        else
            throw new SyntaxException("Unknown statement, "+statement );
    }

    /**
     * Parses ... .
     *
     * @param properties properties object where the compiler flags are saved
     * @param context context builder instance where the pre compiles java
     *                source is putted in
     * @param statement the statement that will be parsed
     */
    public void parseCondition( IndentMarkerHolder marker , String statement )
    {
             if( condition.fits(statement))
                 condition.parse( marker , statement);
        else
            throw new SyntaxException("Unknown statement, "+statement );
    }


    /**
     * Parses ... .
     *
     * @param properties properties object where the compiler flags are saved
     * @param context context builder instance where the pre compiles java
     *                source is putted in
     * @param statement the statement that will be parsed
     */
    public void parseVarReturnerStatement( IndentMarkerHolder marker , String statement )
    {
             if( variable.fits(statement))
                 variable.parse( marker , statement);
        else
            throw new SyntaxException("Unknown statement, "+statement );
    }

    /**
     * Parses a part of an arithmetic operation statement.
     *
     * @param properties properties object where the compiler flags are saved
     * @param context context builder instance where the pre compiles java
     *                source is putted in
     * @param statement the statement that will be parsed
     */
    public void parseOperationPartStatement( IndentMarkerHolder marker , String statement )
    {
             if(operationNumber.fits(statement))
                operationNumber.parse( marker , statement);
        else if(operationVar.fits(statement))
                operationVar.parse( marker , statement);
        else
            throw new SyntaxException("Unknown statement, "+statement );
    }

    /**
     * Parses an actor statement. This is the default statement type in every
     * source code like callFunction, setVariable and so on.
     *
     * @param properties properties object where the compiler flags are saved
     * @param context context builder instance where the pre compiles java
     *                source is putted in
     * @param statement the statement that will be parsed
     */
    public void parseActorStatement( IndentMarkerHolder marker , String statement )
    {
             if( arithmeticOp.fits(statement) )
                 arithmeticOp.parse( marker , statement);
        else if( whileS.fits(statement) )
                 whileS.parse( marker , statement);
        else if( setVariable.fits(statement) )
                 setVariable.parse( marker , statement);
        else if( increament.fits(statement) )
                 increament.parse( marker , statement);
        else if( decreament.fits(statement) )
                 decreament.parse( marker , statement);
        else
            throw new SyntaxException("Unknown statement, "+statement );
    }

    public boolean isFunction( String statement )
    {
        return function.fits(statement);
    }

    /**
     * Returns the singleton instance of the singleton class.
     * @return parser dictionary instance
     */
    public static NodeDictionary getInstance()
    {
        return NodeDictionary.INSTANCE;
    }

 }

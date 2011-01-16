package com.meowShell.parser.nodes;

import com.meowShell.compiler.MeoWShellCompiler;
import com.meowShell.exception.SyntaxException;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class Condition implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        return true;
    }

    public void parse(Properties properties, StringBuilder context, Statement statement)
    {
        assertNotNull( statement , context , properties );
        assertGreater( statement.getStatement().length() , 0);

        boolean trace = properties.containsKey( MeoWShellCompiler.TRACE );

        String statementStr = statement.getStatement();

        if( trace )
            System.out.println("MeoWCompiler :: pre compile condition statement\n  "+statementStr);

        if( statementStr.contains("||") || statementStr.contains("&&"))
        {
            int i;
            int p; // pointer
            int e = statementStr.length();
            char ch;
            int ingoreBr = 0;
            boolean inBr = false;
            for( p = 0 , i = 0 ; i < e ; i++ )
            {
                if( !inBr ){
                    if( statementStr.charAt(i) == '|' )
                    {
                        if( i+1 < e && statementStr.charAt(i+1) == '|' )
                        {
                                i++;

                                if( i-p > 3 )
                                    parseSingleConditionStatement(properties, statementStr.substring(p, i-1), context);

                                context.append(" || ");
                                p = i+1;
                        }
                        else
                            throw new SyntaxException("illegal compare operator");
                    }
                    else if( statementStr.charAt(i) == '&' )
                    {
                        if( i+1 < e && statementStr.charAt(i+1) == '&' )
                        {
                                i++;

                                if( i-p > 3 )
                                    parseSingleConditionStatement(properties, statementStr.substring(p, i-1), context);

                                context.append(" && ");
                                p = i+1;
                        }
                        else
                            throw new SyntaxException("illegal compare operator");
                    }
                }
                
                
                         if( statementStr.codePointAt(i) == '(' )
                         {
                             if( ingoreBr > 0 ) ingoreBr++;
                             else
                             {
                                 if( isConditionBrank(true, i, statementStr) )
                                 {
                                     if( trace )
                                         System.out.println("opened sub condition");

                                     context.append("(");
                                     p = i+1;
                                     inBr = true;
                                 }
                                 else ingoreBr++;
                             }
                         }
                        else if( statementStr.codePointAt(i) == ')' )
                        {
                             if( ingoreBr > 0 ) ingoreBr--;
                             else
                             {
                                 if( isConditionBrank(false, i, statementStr) )
                                 {
                                     parse(properties, context, new Statement(statementStr.substring(p, i), -1));
                                     context.append(")");
                                     p = i+1;

                                     if( trace )
                                         System.out.println("closed sub condition");

                                     inBr = false;
                                 }
                                 else
                                     throw new SyntaxException("( is missing in a condition block");
                             }
                        }
                
            }
            if( p < statementStr.length() )
                parseSingleConditionStatement(properties, statementStr.substring(p, statementStr.length()), context);
        }
        else
            parseSingleConditionStatement( properties , statementStr, context);
    }

    private void parseSingleConditionStatement( Properties properties, String statement , StringBuilder context )
    {
        if( properties.containsKey( MeoWShellCompiler.TRACE ) )
            System.out.println("Try to compile single condition statement "+statement);
        
        if( statement.contains("<=") || statement.contains(">=") || 
            statement.contains("<") || statement.contains(">") ||
            statement.contains("==") || statement.contains("!=")
          )
            parseCompareStatement( properties , statement, context);
        else
            parseBoolStatement( properties , statement, context);
    }

    private boolean isConditionBrank( boolean leftBlank , int index , String str )
    {
        if( index == 0 || index == str.length()-1 )
            return true;
        
        index = ( leftBlank )? index-1 : index+1;

        return ( str.charAt(index) == '&' || str.charAt(index) == '|' );
    }

    private void parseBoolStatement( Properties properties, String statement , StringBuilder context )
    {
        NodeDictionary.getInstance().parseReturnerStatement(properties, context, new Statement(statement,-1));
        context.append(".getBoolean()");
    }

    private void parseCompareStatement( Properties properties, String statement , StringBuilder context )
    {
        int[] index = getIndexes(statement);        
        String left = statement.substring(0,index[0]);
        String right = statement.substring(index[1],statement.length());
        String sign = statement.substring( index[0] , index[1] );
        NodeDictionary dict = NodeDictionary.getInstance();

        dict.parseOperationPartStatement( properties , context, new Statement(left, -1));

        context.append( sign );

        dict.parseOperationPartStatement( properties , context, new Statement(right, -1));
    }

    private int[] getIndexes( String condition )
    {
        int[] ar = new int[2];

        int i;
        int e = condition.length();
        char ch;
        for( i = 0 ; i < e ; i++ )
        {
            ch = condition.charAt(i);
            if( ch == '<' || ch == '>' || ch == '='  || ch == '!' )
            {
                ar[0] = i;
                ch = condition.charAt(i+1);
                if( ch != '>' && ch != '<' )
                {
                    if( ch == '=' )
                    {
                        ar[1] = i+2;
                        break;
                    }
                    else
                    {
                        ch = condition.charAt(i);
                        
                        // after a '!' or '=' must follow a '=' ( == , != )
                        if( ch == '!' || ch == '=' )
                            throw new SyntaxException("wrong compare operator");
                        
                        ar[1] = i+1;

                        break;
                    }
                }
                else throw new SyntaxException("wrong compare operator");
            }
        }

        return ar;
    }
}

package com.meowShell.parser.nodes;

import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;

import static com.yasl.application.ApplicationFlags.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.assertions.Assertions.*;

/**
 * Condition statement.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class Condition extends Node
{

    @Override
    public boolean fits(String statement)
    {
        assertNotNull(statement);
        assertGreater(statement.length(), 0);

        return true;
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull(statement, nodeTree);
        assertGreater(statement.length(), 0);

        if( appFlagExist( COMPILER_DEBUG ) )
            log("Pre compile condition statement:"+statement);

        if ( statement.contains("||") || statement.contains("&&")) {
            int i;
            int p; // pointer
            int e = statement.length();
            char ch;
            int ingoreBr = 0;
            boolean inBr = false;
            for (p = 0, i = 0; i < e; i++) {
                if (!inBr) {
                    if (statement.charAt(i) == '|') {
                        if (i + 1 < e && statement.charAt(i + 1) == '|') {
                            i++;

                            if (i - p > 3) {
                                parseSingleConditionStatement( statement.substring(p, i - 1), nodeTree );
                            }

                            nodeTree.marker.node.addJavaSourceCode(" || ");
                            
                            p = i + 1;
                        } else {
                            throw new SyntaxException("illegal compare operator");
                        }
                    } else if (statement.charAt(i) == '&') {
                        if (i + 1 < e && statement.charAt(i + 1) == '&') {
                            i++;

                            if (i - p > 3) {
                                parseSingleConditionStatement( statement.substring(p, i - 1), nodeTree );
                            }

                            nodeTree.marker.node.addJavaSourceCode(" && ");

                            p = i + 1;
                        } else {
                            throw new SyntaxException("illegal compare operator");
                        }
                    }
                }


                if (statement.codePointAt(i) == '(') {
                    if (ingoreBr > 0) {
                        ingoreBr++;
                    } else {
                        if (isConditionBrank(true, i, statement)) {

                            if( appFlagExist( COMPILER_DEBUG ))
                                log("opened sub condition");

                            nodeTree.marker.node.addJavaSourceCode("(");
                            
                            p = i + 1;
                            inBr = true;
                        } else {
                            ingoreBr++;
                        }
                    }
                } else if (statement.codePointAt(i) == ')') {
                    if (ingoreBr > 0) {
                        ingoreBr--;
                    } else {
                        if (isConditionBrank(false, i, statement)) {
                            
                            parse( nodeTree , statement.substring(p, i) );
                            
                            nodeTree.marker.node.addJavaSourceCode(")");

                            p = i + 1;

                            if( appFlagExist( COMPILER_DEBUG ))
                                log("closed sub condition");

                            inBr = false;
                        } else {
                            throw new SyntaxException("( is missing in a condition block");
                        }
                    }
                }

            }
            if (p < statement.length()) {
                parseSingleConditionStatement( statement.substring(p, statement.length()), nodeTree );
            }
        } else {
            parseSingleConditionStatement( statement, nodeTree );
        }
    }

    private void parseSingleConditionStatement( String statement , IndentMarkerHolder treeNode )
    {
        if( appFlagExist( COMPILER_DEBUG ) )
            log("Parsing single condition statement: "+statement);

        if( statement.contains("<=") || statement.contains(">=") ||
            statement.contains("<") || statement.contains(">") ||
            statement.contains("==") || statement.contains("!=")
          )
            parseCompareStatement( statement, treeNode );
        else
            parseBoolStatement( statement , treeNode );
    }

    private boolean isConditionBrank( boolean leftBlank , int index , String str )
    {
        if( index == 0 || index == str.length()-1 )
            return true;

        index = ( leftBlank )? index-1 : index+1;

        return ( str.charAt(index) == '&' || str.charAt(index) == '|' );
    }

    private void parseBoolStatement( String statement , IndentMarkerHolder treeNode )
    {
        NodeDictionary.getInstance().parseReturnerStatement( treeNode , statement);
        treeNode.marker.node.addJavaSourceCode(".getBoolean()");
    }

    private void parseCompareStatement( String statement , IndentMarkerHolder treeNode )
    {
        int[] index = getIndexes(statement);
        String left = statement.substring(0,index[0]);
        String right = statement.substring(index[1],statement.length());
        String sign = statement.substring( index[0] , index[1] );
        NodeDictionary dict = NodeDictionary.getInstance();

        dict.parseOperationPartStatement( treeNode , left );

        treeNode.marker.node.addJavaSourceCode(sign);

        dict.parseOperationPartStatement( treeNode , right );
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

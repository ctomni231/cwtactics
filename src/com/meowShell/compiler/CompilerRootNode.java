package com.meowShell.compiler;

import java.util.Map.Entry;
import java.util.Set;
import java.util.HashMap;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Compiler class node, contains all block nodes of the class root node.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class CompilerRootNode
{
    private HashMap<String,CompilerBlockNode> nodes;

    public CompilerRootNode()
    {
        nodes = new HashMap<String,CompilerBlockNode>();
    }

    /**
     * Adds a node with a given block name.
     *
     * @param blockName block name key
     * @param node block node that will be added
     */
    public void addNode( String blockName , CompilerBlockNode node )
    {
        assertNotNull(node,blockName);
        assertNotInMap( blockName , nodes);

        if( appFlagExist( COMPILER_DEBUG ) )
            log("Adding block node "+blockName);

        nodes.put(blockName,node);
    }

    /**
     * Get the node for a given name.
     *
     * @param blockName block name string
     * @return the compiler block node for the given name
     */
    public CompilerBlockNode getNode( String blockName )
    {
        assertNotNull(blockName);
        assertInMap(blockName,nodes);

        return nodes.get(blockName);
    }

    /**
     * Returns the keys of all nodes of this root context.
     *
     * @return set of strings
     */
    public Set<Entry<String,CompilerBlockNode>> getKeys()
    {
        return nodes.entrySet();
    }
}

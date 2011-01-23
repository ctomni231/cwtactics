package com.meowShell.parser;

import com.meowShell.compiler.CompilerBlockNode;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Indent marker for the parser class.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class IndentMarker
{
    public IndentMarker( IndentMarker marker, CompilerBlockNode node, int indent )
    {
        // -1 is the top level indention
        assertGreaterEquals(indent, -1);
        assertNotNull(node);

        this.node = node;
        this.preDecessor = marker;
        this.indention = indent;
    }

    public final CompilerBlockNode node;
    public final IndentMarker preDecessor;
    public final int indention;

    public static class IndentMarkerHolder
    {
        public IndentMarker marker;
    }
}

package com.meowShell;

import com.meowShell.compiler.MeoWShellCompiler;
import com.meowShell.context.CallAbleBlock;
import com.meowShell.parser.MeoWShellParser;
import com.meowShell.parser.statements.ContextBlock;
import java.util.LinkedList;
import java.util.Properties;
import junit.framework.Assert;
import org.junit.Test;

/**
 * ArithmeticTest.java
 *
 * This contains various classes to test the arithmetic of MeoWScript
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.17.11
 */

public class ArithmeticTest {

    public CallAbleBlock func;

    @Test
    public void incrementTest(){
        LinkedList<String> code = new LinkedList<String>();
        code.add("n = 0");
        code.add("while n >= 0 && n < 1000 : n++");
        code.add("x = 1000");
        code.add("while x > 0 && x <= 1000 : x--");

        ContextBlock bl = MeoWShellParser.getInstance().parse(code);

        Properties p = new Properties();
        MeoWShellCompiler.setTraceOn(p);
        func = MeoWShellCompiler.getInstance().compileBlock( p , bl);
        func.call();

        Assert.assertNotNull(func);
    }

    //Dual test for arithmetic does not work
    /*@Test
    public void decrementTest(){
        LinkedList<String> code = new LinkedList<String>();
        code.add("x = 1000");
        code.add("while x > 0 && x <= 1000 : x--");

        ContextBlock bl = MeoWShellParser.getInstance().parse(code);

        Properties p = new Properties();
        MeoWShellCompiler.setTraceOn(p);
        func = MeoWShellCompiler.getInstance().compileBlock( p , bl);
        func.call();

        Assert.assertNotNull(func);
    }*/
}

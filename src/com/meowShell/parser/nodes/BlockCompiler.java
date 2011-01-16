package com.meowShell.parser.nodes;

import com.meowShell.context.CallAbleBlock;
import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.statements.StatementBlock;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.NotFoundException;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.01.2011
 */
public class BlockCompiler
{

    // singleton instance
    private static final BlockCompiler INSTANCE = new BlockCompiler();
    private ClassPool classPool;
    private CtClass callAble;

    private BlockCompiler()
    {
        try
        {
            classPool = ClassPool.getDefault();
            callAble = classPool.getCtClass("com.meowShell.context.CallAbleBlock");
        } 
        catch (NotFoundException ex)
        {
            System.err.println("can't initialize meow shell compiler");
            System.exit(1);
        }
    }

    public CallAbleBlock compileFunction( String name , String block )
    {
        try
        {
            CtClass clazz = classPool.makeClass(name, callAble);

            CtMethod method = new CtMethod( callAble.getDeclaredMethod("call"), clazz, null);

            method.setBody( block );
            
            clazz.addMethod(method);
            return (CallAbleBlock) clazz.toClass().newInstance();
        }



        catch (NotFoundException ex)
        {
            Logger.getLogger(BlockCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }        catch (InstantiationException ex)
        {
            Logger.getLogger(BlockCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }        catch (IllegalAccessException ex)
        {
            Logger.getLogger(BlockCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }        catch (CannotCompileException ex)
        {
            Logger.getLogger(BlockCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new SyntaxException();
    }

    /**
     * Returns the singleton instance of the singleton class.
     * @return instance
     */
    public static BlockCompiler getInstance()
    {
        return BlockCompiler.INSTANCE;
    }
 }

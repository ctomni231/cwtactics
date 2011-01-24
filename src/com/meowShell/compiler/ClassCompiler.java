package com.meowShell.compiler;

import java.util.Map.Entry;
import java.util.Set;
import com.meowShell.context.Script;
import com.meowShell.exception.SyntaxException;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.NotFoundException;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;


/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.01.2011
 */
public class ClassCompiler
{

    // singleton instance
    private static final ClassCompiler INSTANCE = new ClassCompiler();
    private static final String PACKAGE = "com.meoWShell.scripts.meoWScript";
    private static int COUNTER = 0;

    private ClassPool classPool;
    private CtClass superClass;
    private CtMethod superMethod;

    private ClassCompiler()
    {
        try
        {
            classPool = ClassPool.getDefault();
            superClass = classPool.getCtClass("com.meowShell.context.Script");
            superMethod = superClass.getDeclaredMethod("call");
        } 
        catch (NotFoundException ex)
            { criticalExit("can't initialize meow shell compiler"); }
    }

    public Script compileBlock( CompilerRootNode rootNode )
    {

        try
        {
            //int num;

            synchronized( INSTANCE )
            {
                //num = COUNTER;
                COUNTER++;
            }

            CtClass clazz = classPool.makeClass( PACKAGE+COUNTER, superClass);
            CtMethod method;

            Set<Entry<String,CompilerBlockNode>> keys = rootNode.getKeys();

            Iterator<Entry<String,CompilerBlockNode>> it = keys.iterator();
            Entry<String,CompilerBlockNode> el;

            // add method signatures
            while( it.hasNext() )
            {
                el = it.next();

                method = new CtMethod( superMethod , clazz, null );
                method.setName( el.getKey() );

                clazz.addMethod(method);
            }

            it = keys.iterator();

            String body;
            // add method bodies
            while( it.hasNext() )
            {
                el = it.next();

                method = clazz.getDeclaredMethod( el.getKey() );

                body = el.getValue().getJavaSourceCode();
                if( appFlagExist(COMPILER_DEBUG) )
                    log( el.getKey() +" with body "+ body );

                method.setBody( body );
            }

            // compile clazz and return instance
            return (Script) clazz.toClass().newInstance();
        }
        catch (NotFoundException ex)
        {
            Logger.getLogger(ClassCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }
        catch (InstantiationException ex)
        {
            Logger.getLogger(ClassCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }
        catch (IllegalAccessException ex)
        {
            Logger.getLogger(ClassCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }
        catch (CannotCompileException ex)
        {
            Logger.getLogger(ClassCompiler.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new SyntaxException();
    }

    /**
     * Returns the singleton instance of the singleton class.
     * @return instance
     */
    public static ClassCompiler getInstance()
    {
        return ClassCompiler.INSTANCE;
    }
 }

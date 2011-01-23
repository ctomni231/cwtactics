/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.yasl.log;

import org.junit.Test;

import static com.yasl.logging.Logging.*;

public class LoggingTest
{

    /**
     * Test of log method, of class Logging.
     */
    @Test
    public void testLogger()
    {
        log("testing logger service");

        warn("warning message");

        critical("this should not be happen, expect here in this statement :P");
    }
}
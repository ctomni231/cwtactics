package com.cwt.system.jslix.debug;

import java.text.NumberFormat;
import java.util.Vector;
import static com.yasl.logging.Logging.*;

/**
 * MemoryTest.java
 * 
 * A remix of BenchTest in CWX. This class gets Memory Usage in the
 * program which is exceptionally useful for debug cases.
 *
 * @author <ul><li>Raether, Eugene</li>
 *          <li>Carr, Crecen</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 */

public class MemoryTest {

    //References the bytes used
   private static String[] reference = {"B", "KB", "MB", "GB", "TB"};

   /**
    * This function changes the size of bytes in a readable format
    * @param bytes The number of bytes
    * @param decimalPlaces How many decimal places to display
    * @return A properly formatted string containing the amount of bytes
    */
   public static String simplyFileSize(long bytes, int decimalPlaces){
         long kB = bytes / 1024;
         long mB = kB / 1024;
         long gB = mB / 1024;
         long tB = gB / 1024;

         long[] data = {bytes, kB, mB, gB, tB};
         int highest = 0;

         for(int x=0;x<data.length;x++){
            if(data[x] == 0)
               break;
            else
               highest = x;
         }

         NumberFormat format = NumberFormat.getInstance();
         format.setMaximumFractionDigits(decimalPlaces);
         format.setMinimumFractionDigits(decimalPlaces);

         return format.format(data[highest])+" "+reference[highest];
     }

   /**
    * This class prints the total memory usage of the JVM so far in the
    * system within a text format.
    * @param notifier A String to prefix the size data.
    */
    public static void printMemoryUsage(String notifier){
         log(notifier+": "+trunBytes(getMemoryUsage()));
    }

    /**
     * This class calculates the maximum memory of the machine
     * @return The maximum memory this JVM can access
     */
    public static String calcMaxMem(){
        long l = time();
        Vector<byte[]> localVector = new Vector<byte[]>(512);
        for (int i = 0; (i < 512) && (time() - l < 2500L); i++)
        try{
            localVector.addElement(new byte[1048576]);
        }catch (Throwable localThrowable){
            localVector.removeAllElements();
            return i + " MB";
        }
        return ">" + localVector.size() + " MB";
    }

    /**
     * This function changes a byte number into a properly formatted string
     * @param bytes THe number of bytes
     * @return A properly formatted string of bytes
     */
     private static String trunBytes(long bytes){
         long kB = bytes / 1024;
         long mB = kB / 1024;
         long gB = mB / 1024;
         long tB = gB / 1024;

         return tB > 1 ? "TB:"+tB : gB > 1 ? "GB:"+gB : mB > 1 ? "MB:"+mB :
             kB > 1 ? "KB:"+kB : "Bytes:"+bytes;
      }

     /**
      * Gets the current memory usage for the program
      * @return The current memory usage
      */
     private static long getMemoryUsage(){
         return Runtime.getRuntime().totalMemory()-
                 Runtime.getRuntime().freeMemory();
     }

     /**
      * Gets the current time of the system
      * @return The current time in milliseconds
      */
     private static long time(){
        return System.currentTimeMillis();
     }
}

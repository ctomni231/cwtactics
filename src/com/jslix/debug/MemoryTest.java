package com.jslix.debug;

import java.text.NumberFormat;
import java.util.Vector;

/**
 * MemoryTest
 * 
 * A remix of BenchTest in CWX. This class gets Memory Usage in the
 * program which is exceptionally useful for debug cases.
 *
 * @author Eugene
 */
public class MemoryTest {

    //JSR: References the bytes used
   private static String[] reference = {"B", "KB", "MB", "GB", "TB"};

   //JSR: Translates bytes properly formatted
   public static String simplyFileSize(long bytes, int decimalPlaces){
         long kB = bytes / 1024;
         long mB = kB / 1024;
         long gB = mB / 1024;
         long tB = gB / 1024;

         long[] data = {bytes, kB, mB, gB, tB};
         int highest = 0;

         for(int x=0;x<data.length;x++)
         {
            if(data[x] == 0)
            {
               break;
            }
            else
            {
               highest = x;
            }
         }

         NumberFormat format = NumberFormat.getInstance();
         format.setMaximumFractionDigits(decimalPlaces);
         format.setMinimumFractionDigits(decimalPlaces);


         return format.format(data[highest])+" "+reference[highest];
     }

   //JSR: Prints the memory usage so far for the program using the
   //Notifier as a channel
     public static void printMemoryUsage(String notifier){
         System.out.println(notifier+": "+trunBytes(getMemoryUsage()));
     }

     //JSR: Calculates Max Memory of your machine
     public static String calcMaxMem(){
        long l = time();
        Vector localVector = new Vector(512);
        for (int i = 0; (i < 512) && (time() - l < 2500L); i++)
        try{
            localVector.addElement(new byte[1048576]);
        }catch (Throwable localThrowable){
            localVector.removeAllElements();
            return i + " MB";
        }
        return ">" + localVector.size() + " MB";
     }

     //JSR: Translates bytes into the Proper format
     private static String trunBytes(long bytes){
         long kB = bytes / 1024;
         long mB = kB / 1024;
         long gB = mB / 1024;
         long tB = gB / 1024;

         return tB > 1 ? "TB:"+tB : gB > 1 ? "GB:"+gB : mB > 1 ? "MB:"+mB :
             kB > 1 ? "KB:"+kB : "Bytes:"+bytes;
      }

     //JSR: Gets the memory usage for the program
     private static long getMemoryUsage(){
         return Runtime.getRuntime().totalMemory()-
                 Runtime.getRuntime().freeMemory();
     }

     //JSR: Gets the time of the system
     private static long time(){
        return System.currentTimeMillis();
     }


}



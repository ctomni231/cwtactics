/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Radom, Alexander [BlackCat]
 */
public class NewClass {
  
  public static void main( String[] args )
  {
    int n = 0;
    while( true )
    {
      n++;
      long time = System.currentTimeMillis();
      int i= 10000000;
      while( i > 0 )
        i--;

      System.out.println( (System.currentTimeMillis()-time)+"ms");
    }
  }
}

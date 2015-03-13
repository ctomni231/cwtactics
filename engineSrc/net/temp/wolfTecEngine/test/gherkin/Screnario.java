package net.temp.wolfTecEngine.test.gherkin;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class Screnario {

  public String name;
  public String description;
  public Array<String> given;
  public Array<String> when;
  public Array<String> then;
  
  public Screnario () {
    given = JSCollections.$array();
    when = JSCollections.$array();
    then = JSCollections.$array();
  }
}

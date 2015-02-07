package net.wolfTec.wtEngine;
import org.stjs.javascript.functions.Callback0;


public interface GameInitializationListener {

  default void onGameLoaded (Callback0 callback){
    callback.$invoke();
  }
}

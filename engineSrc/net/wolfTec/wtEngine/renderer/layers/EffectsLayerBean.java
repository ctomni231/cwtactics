package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.model.WeatherType;
import net.wolfTec.wtEngine.renderer.AnimatedLayer;
import net.wolfTec.wtEngine.renderer.Layer;
import net.wolfTec.wtEngine.renderer.ScreenLayer;

import org.stjs.javascript.Array;
import org.stjs.javascript.Date;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;

@Bean public class EffectsLayerBean extends ScreenLayer implements AnimatedLayer {

  private Logger log;

  private int time;
  private int store;
  private int cap;
  private Array<Integer> type;
  private Array<Integer> posx;
  private Array<Integer> posy;

  @Override public int getZIndex() {
    return 5;
  }
  
  @Override public int getSubStates() {
    return 1;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Effects";
  }
  
  /* Since the time is so low I probably don't need to track it. But it seems memory intensive to pull off,
   * there has to be a less expensive way */
  public void initWeather() {

      //Keeps track of the frequency of a raindrop
      var FREQUENCY = 1;

      //Maximum frame wait per particle
      var MAX = 8;

      //Keeps track of the time
      var time;

      //Keeps track of delta time
      var store;

      //Keeps track of the cap
      var cap;

      //The type of raindrop/snow flake to draw
      var type;

      //The x-axis position of the raindrop/snow flake
      var posx;

      //The y-axis position of the raindrop/snow flake
      var posy;

      var activeGraphic;

      var ball;

      //Holds the graphics for a simple raindrop (cache). Totally hard coded all the values here
      var raindropGfx = document.createElement('canvas');
      ball.width = 10;
      ball.height = 10;

      var raindropCtx = raindropGfx.getContext('2d');
      raindropCtx.strokeStyle = "rgba(255,255,255,0.3)";
      raindropCtx.lineWidth = 1;
      raindropCtx.beginPath();
      raindropCtx.moveTo(0, 0);
      raindropCtx.lineTo(4, 10);
      raindropCtx.stroke();


  }
  
  public void setWeatherType(WeatherType weather) {
    time = 0;
    store = 0;
    cap = 50;
    type = JSCollections.$array();
    posx = JSCollections.$array();
    posy = JSCollections.$array();
  }

  public void updateWeather(int delta) {

  }

  public void renderWeather() {
    CanvasRenderingContext2D ctx = getContext(Constants.INACTIVE_ID);

    // Tests the speed of each particle for debug mode
    time = (int) new Date().getTime();

    // Render particles
    for (int i = 0; i < type.$length(); i++) {
      if (type.$get(i) == -1) {
        continue;
      }

      ctx.drawImage(activeGraphic, posx.$get(i), posy.$get(i), 10 + 5 * type.$get(i), 10 + 5 * type.$get(i));
    }

    // Tests the speed of each particle for debug mode
    log.info("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
  }
}
